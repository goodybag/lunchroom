
var PATH = require("path");

var TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


// @docs http://knexjs.org/#Schema

exports.up = function (knex, Promise) {

	console.log("knex migrations up for: " + TABLE_NAME);

	return knex.schema.createTable(TABLE_NAME, function (t) {
		t.increments('id');

		// NOTE: When you make changes here, you
		//       LIKELY ALSO WANT TO MAKE CHANGES
		//       here './api.schema.js'!

		t.text('orderHashId').notNullable();
		t.text('status').notNullable();
		t.timestamp('time').notNullable().defaultTo(knex.raw('now()'));

	}).then(function () {

		// @see http://bjorngylling.com/2011-04-13/postgres-listen-notify-with-node-js.html
		// @see http://www.postgresql.org/docs/9.1/static/sql-createfunction.html
		var query = [
			'CREATE OR REPLACE FUNCTION notify_order_status_changed() RETURNS trigger AS $$',
			'DECLARE',
			'BEGIN',
			"  PERFORM pg_notify('order_status_changed', TG_TABLE_NAME || ',id,' || NEW.id );",
			'  RETURN new;',
			'END;',
			'$$ LANGUAGE plpgsql;'
		];

		return knex.raw(query.join(" ")).then(function(resp) {

//console.log("resp1", resp);

			// @see http://www.postgresql.org/docs/9.1/static/sql-createtrigger.html
			var query = [
				'CREATE TRIGGER order_status_changed AFTER INSERT ON "' + TABLE_NAME + '"',
				'FOR EACH ROW EXECUTE PROCEDURE notify_order_status_changed();'
			];

			return knex.raw(query.join(" ")).then(function(resp) {

//console.log("resp2", resp);

			});
		});
	});
};


exports.down = function (knex, Promise) {

	console.log("knex migrations down for: " + TABLE_NAME);

	return knex.schema
		.dropTableIfExists(TABLE_NAME);
};


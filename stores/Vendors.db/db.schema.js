
const PATH = require("path");

const TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


// @docs http://knexjs.org/#Schema

exports.up = function (knex, Promise) {

	console.log("knex migrations up for: " + TABLE_NAME);

	return knex.schema
		.createTable(TABLE_NAME, function (t) {
			t.increments('id');


			// NOTE: When you make changes here, you
			//       LIKELY ALSO WANT TO MAKE CHANGES
			//       here './api.schema.js'!

			t.text('title').notNullable();
			t.text('description').notNullable();
			t.text('adminAccessToken').notNullable();

		});
};


exports.down = function (knex, Promise) {

	console.log("knex migrations down for: " + TABLE_NAME);

	return knex.schema
		.dropTableIfExists(TABLE_NAME);
};


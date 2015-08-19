
const PATH = require("path");
const FS = require("fs-extra");
const Q = require("q");
const QFS = require("q-io/fs");
const KNEX = require('knex');
const BOOKSHELF = require('bookshelf');
const LIVE_NOTIFY = require("../live-notify");
const CRYPTO = require("crypto");


var knex = null;
var bookshelf = null;

exports.init = function (config, options) {

	config.debug = true;//(!!config.connection.debug);
	config.client = "pg";


	console.log("DB user", config.connection.user);
	console.log("DB database", config.connection.database);
	console.log("DB host", config.connection.host);
	console.log("DB port", config.connection.port);


	// @see http://knexjs.org/#Installation-node
	knex = KNEX(config);

	// @see http://bookshelfjs.org/#installation
	bookshelf = BOOKSHELF(knex);


	function ensureSchema () {

		// @see http://dataprotocols.org/json-table-schema/
		// @docs http://knexjs.org/#Schema

		function getExistingTables () {
			return knex.raw("SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public'").then(function(resp) {
				var rows = {};
				resp.rows.forEach(function (row) {
					rows[row.tablename] = true;
				});
				return rows;
			});
		}

		return getExistingTables().then(function (tables) {

			function ensureTable (tableName, schema) {
				if (tables[tableName]) return Q.resolve();
				//return knex.schema.dropTable(tableName).then(function () {
					console.log("[db] Create table: " + tableName);
					return knex.schema.createTable(tableName, function (table) {
					});
				//});
			}

			function getExistingFields (tableName) {
				return knex.raw("select * from INFORMATION_SCHEMA.COLUMNS where table_name = '" + tableName + "'").then(function (resp) {
					var rows = {};
					resp.rows.forEach(function (row) {
						rows[row.column_name] = row;
					});
					return rows;
				});
			}

			function ensureFields (tableName, schema) {
				return getExistingFields(tableName).then(function (existingFields) {

					var currentFields = {};

					return knex.schema.table(tableName, function (table) {

						// Add new fields.
						schema.fields.forEach(function (field) {

							currentFields[field.name] = true;

							if (existingFields[field.name]) {

								// Remove constraints if no longer in schema
								if (field.constraints) {
									if (
										schema.primaryKey !== field.name &&
										field.constraints.required !== true &&
										existingFields[field.name].is_nullable === 'NO'
									) {
										console.log("[db] Drop 'required' from field '" + field.name + "' for table '" + tableName + "'");

										knex.raw('ALTER TABLE "' + tableName + '" ALTER COLUMN "' + field.name + '" DROP NOT NULL;').catch(function (err) {
											console.error("SQL Error:", err.stack);
										});
									}
								}
								return;
							}

							// TODO: Modify column on change.

							console.log("[db] Create field: " + field.name);

							var fieldDef = null;

							// Field type
							if (field.constraints && field.constraints.autoincrement === true) {
								fieldDef = table.increments(field.name);
							} else
							// TODO: implement other field types.
							if (field.type === "timestamp") {
								fieldDef = table.timestamp(field.name);
							} else
							if (field.type === "boolean") {
								fieldDef = table.boolean(field.name);
							} else
							if (field.type === "string" || !field.type) {
								fieldDef = table.text(field.name);
							}

							// Field extras
							if (field.constraints) {
								if (field.constraints.required === true) {
									fieldDef = fieldDef.notNullable();
								}
								if (field.constraints.unique === true) {
									fieldDef = fieldDef.unique();
								}
							}

							if (typeof field.default !== "undefined") {
								if (field.default === "Date.now()") {
									fieldDef = fieldDef.defaultTo(knex.raw('now()'));
								} else {
									fieldDef = fieldDef.defaultTo(field.default);
								}
							} else
							if (
								(field.type === "string" || !field.type) &&
								(field.constraints && field.constraints.required === true)
							) {
								fieldDef = fieldDef.defaultTo("");
							}

						});
					}).then(function () {

						// Drop 'required' constraint on old fields to ensure we
						// can insert new records while ignoring old fields.
						return Q.all(Object.keys(existingFields).map(function (name) {
							if (currentFields[name]) return Q.resolve();

							return knex.raw('ALTER TABLE "' + tableName + '" ALTER COLUMN "' + name + '" DROP NOT NULL;').catch(function (err) {
								console.error("SQL Error:", err.stack);
							});
						}));
					});
				});
			}

			var schema = require("../data/schema.json");

			return Q.all(Object.keys(schema.tables).map(function (tableName) {
				return ensureTable(tableName, schema.tables[tableName]).then(function () {
					return ensureFields(tableName, schema.tables[tableName]);
				});
			}));
		});
	}

	function ensureData (name) {

		var done = Q.resolve();

		function insertRecords (table, records) {
			done = Q.when(done, function () {
			    console.log("Seeding table", table, "with", records.length, "records");
			    return records.map(function (record) {

			    	// First ensure record is deleted.
			    	// TODO: Instead of deleting, fetch record and diff it and insert/update changes.
			    	return knex(table).where(
			    		// TODO: Use primary key field.
			    		'id',
			    		record.id
			    	).del().then(function () {

						return knex(table).insert(record);
			    	});
			    });
			});
		}

		// TODO: Import from cater for given IDs once 'overrides' are implemented
		//       instead of pulling from file.
		var data = require("../data/" + name + ".js");

		if (data.seeds) {
			for (var table in data.seeds) {
				insertRecords(
					table,
					Object.keys(data.seeds[table]).map(function (id) {
						return data.seeds[table][id];
					})
				);
			}
		}

		if (data.cater && data.cater.restaurants) {

			var records = {
				vendors: {},
				items: {}
			};

			function makeAdminAccessToken (restaurant_id) {
				return CRYPTO.createHash('sha1').update("secret:seed:id:jksd9SJDKS82jSjsjlpw[9282klsss:" + restaurant_id).digest('hex');
			}

			for (var restaurant_id in data.cater.restaurants) {

				var restaurant = data.cater.restaurants[restaurant_id];

				records.vendors[restaurant_id] = {
					id: restaurant_id,
					title: restaurant.title,
					adminAccessToken: makeAdminAccessToken(restaurant_id),
					description: ""
				};

				restaurant.items.forEach(function (item) {
					records.items[item.id] = {
						"id": item.id,
						"vendor_id": restaurant_id,
						"title": item.name || "",
						"description": item.description || item.name || "",
						"photo_url": item.photo_url || "",
						"price": item.price || "",
						"tags": JSON.stringify(item.tags || [])
					};
				});
			}

			for (var table in records) {
				insertRecords(
					table,
					Object.keys(records[table]).map(function (id) {
						return records[table][id];
					})
				);
			}
		}

/*
		if (data.cater.events) {

			var records = {
				vendors: {},
				items: {}
			};

			for (var id in data.cater.events) {

				var event = data.cater.events[id];

				records.vendors[event.record.restaurant_id] = {
					id: event.record.restaurant_id,
					title: event.overrides.vendor.title,
					adminAccessToken: event.overrides.vendor.adminAccessToken,
					description: ""
				};

				event.record.items.forEach(function (item) {
					records.items[item.id] = {
						"id": item.id,
						"vendor_id": event.record.restaurant_id,
						"title": item.name,
						"description": item.description || item.name,
						"photo_url": item.photo_url,
						"price": item.price
					};
				});
			}

			for (var table in records) {
				insertRecords(
					table,
					Object.keys(records[table]).map(function (id) {
						return records[table][id];
					})
				);
			}
		}
*/

		return done;
	}

	function ensureTriggersAndFunctions () {

		var TABLE_NAME = "order-status";

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

			return knex.raw('DROP TRIGGER IF EXISTS order_status_changed ON "' + TABLE_NAME + '";').then(function(resp) {

				// @see http://www.postgresql.org/docs/9.1/static/sql-createtrigger.html
				var query = [
					'CREATE TRIGGER order_status_changed AFTER INSERT ON "' + TABLE_NAME + '"',
					'FOR EACH ROW EXECUTE PROCEDURE notify_order_status_changed();'
				];

				return knex.raw(query.join(" "));
			});
		});
	};

	function ensureSchemaAndData () {

		// TODO: Only run if DB schema or data has changed.

		console.log('########################################');
		console.log('# Ensuring schema ...');
		console.log('########################################');

		return ensureSchema().then(function () {

			console.log('########################################');
			console.log('# Loading data ...');
			console.log('########################################');

			return ensureData("data.01").then(function () {

				return ensureData("data.02").then(function () {

					console.log('########################################');
					console.log('# Ensuring triggers and function ...');
					console.log('########################################');

					return ensureTriggersAndFunctions();
				});
			});
		});
	}

	function runDevQueries () {

		return Q.resolve();

		return knex.raw("SELECT * FROM orders").then(function(resp) {

console.log("RESP", resp);

		});

	}

	return ensureSchemaAndData().then(function () {

		LIVE_NOTIFY.attachToDatabase(config.connection);

		return runDevQueries().then(function () {

			return {
				knex: knex
	//			database: config.connection.database
			};
		});
	});
}

exports.getBookshelf = function () {
	if (!bookshelf) {
		throw new Error("Must call 'init()' first!");
	}
	return bookshelf;
}

exports.getKnex = function () {
	if (!knex) {
		throw new Error("Must call 'init()' first!");
	}
	return knex;
}

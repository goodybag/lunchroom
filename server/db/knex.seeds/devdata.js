
const PATH = require("path");
const FS = require("fs");
const Q = require("q");
const QFS = require("q-io/fs");


function getSeedPaths () {
	return QFS.list(PATH.join(__dirname, "../../../stores")).then(function (stores) {
		return stores.filter(function (store) {
			return /\.db$/.test(store);
		}).map(function (store) {
			return PATH.join(__dirname, "../../../stores", store, "db.seed");
		}).filter(FS.existsSync);
	});
}

exports.seed = function (knex, Promise) {

	return ensureData(knex, "data.01").then(function () {

		return getSeedPaths().then(function (seedPaths) {

			return Promise.each(seedPaths, function (seedPath) {

				console.log("Loading db seed from:", seedPath);

				return require(seedPath).seed(knex, Promise);
			});
		});
	});

};

function ensureData (knex, name) {

	var done = Q.resolve();

	function insertRecords (table, records) {
		done = Q.when(done, function () {
		    console.log("Seeding table", table, "with", records.length, "records");
		    // TODO: Only insert if not already exist.
			return knex(table).insert(records);
		});
	}

	// TODO: Import from cater for given IDs once 'overrides' are implemented
	//       instead of pulling from file.
	var data = require("../../data/" + name + ".js");

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
					"photo_url": item.photo_url,
					"description": "",
					"price": item.price,
					"properties": {
					},
					"options": {
					}
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

	return done;
}

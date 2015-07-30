
const PATH = require("path");
const MOMENT = require("moment");


const TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


exports.seed = function (knex, Promise) {

	var records = [];

	for (var day=0 ; day<=4 ; day++) {

		for (var item=1 ; item<=6 ; item++) {

			records.push({
				"event_id": day+1,
				"vendor_id": 1,
				"item_id": item
			});
		}
	}

    console.log("Seeding table", TABLE_NAME, "with", records.length, "records");

	return knex(TABLE_NAME).insert(records);
};


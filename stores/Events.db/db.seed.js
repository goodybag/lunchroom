
const PATH = require("path");
const MOMENT = require("moment");


const TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


exports.seed = function (knex, Promise) {

	var records = [];
/*
	for (var day=0 ; day<=4 ; day++) {

		records.push({
			"day_id": MOMENT().add(day, 'days').format("YYYY-MM-DD"),
			"consumer_group_id": 1,
			"orderByTime": MOMENT().add(1, 'hour').add(day, 'days').format(),
			"deliveryStartTime": MOMENT().add(3, 'hour').add(day, 'days').format(),
			"deliveryEndTime": MOMENT().add(3, 'hour').add(30, 'minutes').add(day, 'days').format(),
			"goodybagFee": "5"
		});
	}
*/
    console.log("Seeding table", TABLE_NAME, "with", records.length, "records");

	return knex(TABLE_NAME).insert(records);
};

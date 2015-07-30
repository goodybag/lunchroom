
const PATH = require("path");

const TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


exports.seed = function (knex, Promise) {

	var records = [];
/*
	for (var i=1 ; i<=10 ; i++) {
		records.push({
			"id": i
		});
	}
*/
    console.log("Seeding table", TABLE_NAME, "with", records.length, "records");

	return knex(TABLE_NAME).insert(records);
};


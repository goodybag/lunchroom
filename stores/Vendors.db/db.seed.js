
var PATH = require("path");
var UUID = require("uuid");

var TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


exports.seed = function (knex, Promise) {

	var records = [];
/*
	for (var i=1 ; i<=10 ; i++) {
		records.push({
			"id": i,
			"title": "Restaurant " + i,
			"description": "<p>Some paragraphs about food here.</p>",
			"adminAccessToken": UUID.v4()
		});
	}
*/
    console.log("Seeding table", TABLE_NAME, "with", records.length, "records");

	return knex(TABLE_NAME).insert(records);
};


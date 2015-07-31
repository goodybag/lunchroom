
const PATH = require("path");

const TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


exports.seed = function (knex, Promise) {

	var records = [];

/*
	for (var i=1 ; i<=10 ; i++) {
		records.push({
			"id": i,
			"title": "Company " + i,
			contact: "Gillian Lambert",
			address: "7901 Cameron Rd<br/>Bldg 2, Ste. 300<br/>Austin, TX 78754",
			pickupLocation: "3rd floor Game Room!",
			orderTax: "5"
		});
	}
*/

	records.push({
		"id": 1,
		"title": "Bazaar Voice",
		"alias": "bazaarvoice",
		contact: "Gillian Lambert",
		address: "7901 Cameron Rd<br/>Bldg 2, Ste. 300<br/>Austin, TX 78754",
		pickupLocation: "3rd floor Game Room!",
		orderTax: "5"
	});

    console.log("Seeding table", TABLE_NAME, "with", records.length, "records");

	return knex(TABLE_NAME).insert(records);
};


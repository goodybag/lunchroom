
const PATH = require("path");

const TABLE_NAME = PATH.basename(__dirname)
	.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


exports.seed = function (knex, Promise) {

	var records = [];

	for (var i=1 ; i<=10 ; i++) {
		records.push({
			"id": i,
			"vendor_id": 1,
			"title": "Dos Tacos Box (dish " + i + ")",
			"photo_url": "https://cdn.filepicker.io/api/file/6PqREn6qQHWCQsPdKJXK/convert?cache=true&fit=scale",
			"description": "This package includes your choice of two of any of our tasty Wood Fired Tacos, a side of Charro Beans, Chips and our delicious Warm Salsa (dish " + i + ").",
			"price": 880 * i,
			"properties": {
				"Spiciness": "Hot"
			},
			"options": {
				"Protein": ["Beef", "Chicken", "Tofu"]
			}
		});
	}

    console.log("Seeding table", TABLE_NAME, "with", records.length, "records");

	return knex(TABLE_NAME).insert(records);
};


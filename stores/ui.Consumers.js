var console = require("../app/lib/console");

var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	var collection = DATA.init({

		name: "consumers",

		model: require("./ui.Consumers.model").forContext(context),
		record: {
// TODO: Use record and get rid of model
		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {


		}
	});

	return collection.store;
}


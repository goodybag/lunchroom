
const PATH = require("path");
const API = require("../../server/db/api.endpoints");
const ENDPOINTS = require('endpoints');
const EXTEND = require("extend");
const UUID = require("uuid");


var store = EXTEND(false, {}, ENDPOINTS.Store.bookshelf);

var upstreamCreate = store.create;
store.create = function (model, data) {

	// Generate new token for event.
	data.attributes.token = UUID.v4();

	return upstreamCreate(model, data);
/*
console.log("data", JSON.stringify(data, null, 4));

		return ENDPOINTS.Store.bookshelf.create.call(store, model, data).then(function (resp) {


console.log("resp", resp);


		}).fail(function (err) {

console.error("Error creating record:", err.stack);

			throw err;
		});
	});
*/
	
}


// @docs http://endpointsjs.com
// @docs http://endpointsjs.com/guides/app-structure
// @docs http://endpointsjs.com/api/endpoints/0.5.6/Controller.html

module.exports = new API.Controller({
	model: require('./orm.model'),
	basePath: PATH.basename(__dirname),
	store: store
});

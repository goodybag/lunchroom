
const PATH = require("path");
const API = require("../../server/db/api.endpoints");
const ENDPOINTS = require('endpoints');
const EXTEND = require("extend");
const UUID = require("uuid");

const SERVICES = require("../../server/services");


var store = EXTEND(false, {}, ENDPOINTS.Store.bookshelf);
store.create = function (model, data) {

	return SERVICES.for({}).then(function (SERVICES) {

		// Generate new hash ID for order on creation.
		data.attributes.token = UUID.v4();

		return ENDPOINTS.Store.bookshelf.create.call(store, model, data).then(function (resp) {

			try {

				// TODO: Confirm subscription

				SERVICES.email.send("Order_Placed", {
		            "to": [
		                {
		                    "email": data.attributes.subscribeEmail,
		                    "name": data.attributes.subscribeEmail,
		                    "type": "to"
		                }
		            ]
		        }).then(function () {

					console.log("Email sent!");

				}).fail(function (err) {
					console.error(err.stack);
				});

			} catch (err) {
				console.error(err.stack);
			}

			return resp;
		});
	});
}


// @docs http://endpointsjs.com
// @docs http://endpointsjs.com/guides/app-structure
// @docs http://endpointsjs.com/api/endpoints/0.5.6/Controller.html

module.exports = new API.Controller({
	model: require('./orm.model'),
	basePath: PATH.basename(__dirname),
	store: store
});

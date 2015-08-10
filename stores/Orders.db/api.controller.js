
var PATH = require("path");
var API = require("../../server/db/api.endpoints");
var ENDPOINTS = require('endpoints');
var EXTEND = require("extend");
var UUID = require("uuid");

var SERVICES = require("../../server/services");


var store = EXTEND(false, {}, ENDPOINTS.Store.bookshelf);
store.create = function (model, data) {

	return SERVICES['for']({}).then(function (SERVICES) {

		// Generate new hash ID for order on creation.
		data.attributes.orderHashId = UUID.v4();

		return ENDPOINTS.Store.bookshelf.create.call(store, model, data).then(function (resp) {

			try {

				// TODO: Move to job based on OrderStatus

				SERVICES.email.send("Order_Placed", {
		            "to": [
		                {
		                    "email": "christoph+test1@christophdorn.com",
		                    "name": "Christoph Dorn",
		                    "type": "to"
		                }
		            ]
		        }).then(function () {

					console.log("Email sent!");

				}).fail(function (err) {
					console.error(err.stack);
				});


				SERVICES.sms.send("Order_Placed", {
		            "to": "+17788219208"
		        }).then(function () {

					console.log("SMS sent!");

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

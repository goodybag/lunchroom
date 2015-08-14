
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

		// Let DB create order id
		delete data.attributes.id;

		return ENDPOINTS.Store.bookshelf.create.call(store, model, data);
	});
}

store.update = function (model, params) {

	return SERVICES['for']({}).then(function (SERVICES) {

		return ENDPOINTS.Store.bookshelf.update.call(store, model, params).then(function (resp) {

			try {

				if (resp.attributes['paymentConfirmation']) {

					var form = JSON.parse(resp.attributes.form);

					SERVICES.email.send("Receipt", {
			            "to": [
			                {
			                    "email": form["info[email]"],
			                    "name": form["info[name]"] || form["info[email]"],
			                    "type": "to"
			                }
			            ],
			            "data": {
			            	"items": JSON.parse(resp.attributes.items),
			            	"summary": JSON.parse(resp.attributes.summary),
			            	"orderHashId": resp.attributes.orderHashId
			            }
			        }).fail(function (err) {
						console.error(err.stack);
					});

				}

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

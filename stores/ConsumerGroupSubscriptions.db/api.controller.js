
const PATH = require("path");
const API = require("../../server/db/api.endpoints");
const ENDPOINTS = require('endpoints');
const EXTEND = require("extend");
const UUID = require("uuid");

const DB = require("../../server/db/bookshelf.knex.postgresql");
const SERVICES = require("../../server/services");


var store = EXTEND(false, {}, ENDPOINTS.Store.bookshelf);
store.create = function (model, data, request) {


	return SERVICES.for({}).then(function (SERVICES) {


		function sendSubscriptionConfirmation (consumerGroupSubscription) {

			return DB.getKnex()('consumer-groups').where({
				"id": consumerGroupSubscription.consumer_group_id
			}).then(function (result) {

				if (result.length !== 1) {
					throw new Error("No record found for id: " + consumerGroupSubscription.consumer_group_id);
				}

				try {

					// TODO: Confirm subscription

					SERVICES.email.send("Confirm_Subscription", {
			            "to": [
			                {
			                    "email": data.attributes.subscribeEmail,
			                    "name": data.attributes.subscribeEmail,
			                    "type": "to"
			                }
			            ],
			            "data": {
			            	consumerGroup: result[0],
			            	consumerGroupSubscription: consumerGroupSubscription
			            }
			        }, request).then(function () {

						console.log("Email sent!");

					}).fail(function (err) {
						console.error(err.stack);
					});

				} catch (err) {
					console.error(err.stack);
				}

			});
		}


		// Generate new hash ID for order on creation.
		data.attributes.token = UUID.v4();

		return ENDPOINTS.Store.bookshelf.create.call(store, model, data).then(function (resp) {

			return sendSubscriptionConfirmation(
				data.attributes
			).then(function () {

				return resp;
			});
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


var PATH = require("path");
var API = require("../../server/db/api.endpoints");
var ENDPOINTS = require('endpoints');
var EXTEND = require("extend");
var UUID = require("uuid");
var Q = require("q");
var STRIPE = require("stripe");
var Promise = require("bluebird");

var SERVICES = require("../../server/services");
var DB = require("../../server/db/bookshelf.knex.postgresql");


var store = EXTEND(false, {}, ENDPOINTS.Store.bookshelf);

store.create = function (model, data, request) {

	var qknex = DB.getQKnex();

	return new Promise(function (resolve, reject) {

		return SERVICES['for']({}).then(function (SERVICES) {

			// Generate new hash ID for order on creation.
			data.attributes.orderHashId = UUID.v4();

			// Let DB create order id
			delete data.attributes.id;

console.log("ORDER RECEIVED", data.attributes);

			try {

				function groupItemsByDayAndResolve (data) {

					var ItemsModel = require("../ui.Items.model").forContext(request._FireNodeContext.context);

					var items = JSON.parse(data.attributes.items);

					// Go through all items and group them by day.
					// Then fetch events info for each day.
					var extraInfo = {
						// NOTE: We assume the delivery time and location is the same
						//       for all days!
						deliveryTime: null,
						deliverLocation: null,
						consumerGroupId: null,

						eventIds: {},
						vendorIds: {},
						itemsByDay: {}
					};
					items.forEach(function (item) {
						if (!extraInfo.itemsByDay[item.day_id]) {
							extraInfo.itemsByDay[item.day_id] = {
								"items": []
							};
						}
						extraInfo.itemsByDay[item.day_id].items.push(item);
						extraInfo.eventIds[item.event_id] = item.day_id;
						extraInfo.vendorIds[item.vendor_id] = item.day_id;

						var modeledItem = new ItemsModel(item);

						item["format.price"] = modeledItem.get("format.price");
						item["format.amount"] = modeledItem.get("format.amount");
					});

					function addEventsInfo () {

						var EventsModel = require("../ui.Events.model").forContext(request._FireNodeContext.context);

						return qknex('events', function (table) {
							return table.whereIn('id', Object.keys(extraInfo.eventIds));
						}).then(function (result) {

							result.forEach(function (row) {
								var record = new EventsModel(row);
								var day = extraInfo.itemsByDay[extraInfo.eventIds[record.get("id")]];

								day.deliveryDate = record.get("format.deliveryDate");
								if (!extraInfo.deliveryTime) {
									extraInfo.deliveryTime = record.get("format.deliveryTime");
								}
								if (!extraInfo.consumerGroupId) {
									extraInfo.consumerGroupId = record.get("consumer_group_id");
								}
							});
						});
					}

					function addVendorsInfo () {

						var VendorsModel = require("../ui.Vendors.model").forContext(request._FireNodeContext.context);

						return qknex('vendors', function (table) {
							return table.whereIn('id', Object.keys(extraInfo.vendorIds));
						}).then(function (result) {

							result.forEach(function (row) {
								var record = new VendorsModel(row);
								var day = extraInfo.itemsByDay[extraInfo.vendorIds[record.get("id")]];

								day.orderFrom = record.get("title");
							});
						});
					}

					function addConsumerGroupInfo () {

						var EventsModel = require("../ui.ConsumerGroups.model").forContext(request._FireNodeContext.context);

						return qknex('consumer-groups', function (table) {
							return table.where('id', extraInfo.consumerGroupId);
						}).then(function (result) {

							var record = new EventsModel(result[0]);

							if (!extraInfo.deliverLocation) {
								extraInfo.deliverLocation = record.get("deliverLocation");
							}
						});
					}

					return addEventsInfo().then(function () {

						return addVendorsInfo().then(function () {

							return addConsumerGroupInfo();
						});
					}).then(function () {

						return extraInfo;
					});
				}

				function chargeCard (data) {

					var referenceCode = data.attributes.orderHashId.substring(0, 7).toUpperCase();
					var paymentToken = JSON.parse(data.attributes.paymentToken);
					var summary = JSON.parse(data.attributes.summary);
					var form = JSON.parse(data.attributes.form);

					return Q.denodeify(function (callback) {
						var stripe = STRIPE(request._FireNodeContext.config.stripeSecretKey);
						var payload = {
							amount: summary.total,
							currency: "usd",
							metadata: {
								orderHashId: data.attributes.orderHashId,
								email: form["info[email]"]
							},
							capture: true,
							source: paymentToken.id,
							description: "Lunchroom charge for order '" + referenceCode + "'"
						};
						console.log("Posting to stripe:", JSON.stringify(payload, null, 4));
						stripe.charges.create(payload, function (err, paymentCharge) {
							if (err) return callback(err);

							return callback(null, paymentCharge);
						});
					})().fail(function (err) {

	// TODO: Repeat on non-fatal error.
						console.error("Error charging card:", err.stack);
						throw err;
					});
				}

				function storeOrder (data, paymentCharge) {

					data.attributes.paymentCharge = JSON.stringify(paymentCharge);

console.log("STORE ORDER", data.attributes);

					return Q.fcall(function () {
						return ENDPOINTS.Store.bookshelf.create.call(store, model, data).then(function (resp) {

							/*
							data.attributes = { id: '50',
							  orderHashId: '6cb3b3af-0fbe-4449-bc58-981e35f83d72',
							  time: Sat Aug 15 2015 19:11:12 GMT-0700 (PDT),
							  day_id: '2015-08-15',
							  form: '{"info[name]":"Bill Smith","info[email]":"cadorn.test@gmail.com","info[phone]":"+17788219208","card[name]":"Bill Smith","card[cvc]":"123","card[number]":"4242424242424242","card[expire-month]":"12","card[expire-year]":"2016"}',
							  items: '[{"id":"95994-bf21a9e8fbc5a3846fb05b4fa0859e0917b2202f","item_id":"95994","vendor_id":"10","title":"Club Sandwich Box Lunch with Chips","description":"Item description","photo_url":"https://www.filepicker.io/api/file/8NQBDg0TYqRdVbPPWUua","options":"{}","price":"799","quantity":1,"vendor.title":"McAlister\'s","format.price":"7.99","format.amount":"7.99"}]',
							  event: '{"id":"79","day_id":"2015-08-15","orderByTime":"2015-08-16T02:45:00.000Z","deliveryStartTime":"2015-08-16T03:45:00.000Z","pickupEndTime":"2015-08-16T04:00:00.000Z","consumer_group_id":"3","goodybagFee":"299","tip":"0","token":"d8f4b5ca-e4e2-48c4-b568-2091a0bec20a","menuReady":false,"menuEmailsSent":false,"delivered":false,"deliveredEmailsSent":false,"consumerGroup.title":"Test: Hungry Company","consumerGroup.alias":"test-hc","consumerGroup.contact":"Big stomach","consumerGroup.address":"Right<br/>where it need<br/>to be","consumerGroup.pickupLocation":"Hold out your hands and wiggle your nose","consumerGroup.orderTax":"10","day.format.ddd":"Sat","day.format.MMM":"Aug","day.format.D":"15","day.format.dddd-type":"Weekend","ordersLocked":false,"canOrder":true,"format.deliveryDate":"Saturday, Aug 15th 2015","format.deliveryTime":"8:45-9:00 PM","format.orderByTime":"7:45 PM","format.orderTimer":"34 min","format.orderTimerSeconds":2031,"format.goodybagFee":"$2.99","format.menuReady":"No","format.menuEmailsSent":"No","format.delivered":"No","menuUrl":"http://lunchroom.goodybag.com.local:8091/event-d8f4b5ca-e4e2-48c4-b568-2091a0bec20a"}',
							  vendor_ids: '10',
							  orderFrom: 'McAlister\'s',
							  deliveryStartTime: Sat Aug 15 2015 20:45:00 GMT-0700 (PDT),
							  deliveryEndTime: null,
							  pickupEndTime: Sat Aug 15 2015 21:00:00 GMT-0700 (PDT),
							  paymentToken: '{"id":"tok_16aGc8EQiCMC2eZ7PcmdwrMq","livemode":false,"created":1439691072,"used":false,"object":"token","type":"card","card":{"id":"card_16aGc8EQiCMC2eZ7UwGZATAD","object":"card","last4":"4242","brand":"Visa","funding":"credit","exp_month":12,"exp_year":2016,"country":"US","name":"Bill Smith","address_line1":null,"address_line2":null,"address_city":null,"address_state":null,"address_zip":null,"address_country":null,"cvc_check":"unchecked","address_line1_check":null,"address_zip_check":null,"tokenization_method":null,"dynamic_last4":null,"metadata":{}},"client_ip":"192.200.148.4"}',
							  summary: '{"amount":799,"format.amount":"$7.99","tax":10,"taxAmount":79.9,"format.tax":"10%","format.taxAmount":"$0.80","goodybagFee":299,"format.goodybagFee":"$2.99","total":1178,"format.total":"$11.78"}',
							  event_id: '79'
							}
							*/

							return resp;
						}).catch (function (err) {
							throw err;
						});
					});
				}

				function sendNotifications (data, extraInfo) {

console.log("sendNotifications data", data.attributes);
console.log("sendNotifications extraInfo", JSON.stringify(extraInfo, null, 4));

					var form = JSON.parse(data.attributes.form);


					SERVICES.email.send("Receipt", {
			            "to": [
			                {
			                    "email": form["info[email]"],
			                    "name": form["info[name]"] || form["info[email]"],
			                    "type": "to"
			                }
			            ],
			            "data": {
			            	"items": JSON.parse(data.attributes.items),
			            	"summary": JSON.parse(data.attributes.summary),
			            	"orderHashId": data.attributes.orderHashId,
			            	"deliveryTime": extraInfo.deliveryTime,
			            	"deliverLocation": extraInfo.deliverLocation,
			            	"itemsByDay": extraInfo.itemsByDay
			            }
			        }).fail(function (err) {
						console.error("Error sending receipt:", err.stack);
					});


			        // Send duplicate to goodybag just in case.
					SERVICES.email.send("Receipt", {
			            "to": [
			                {
			                    "email": "payments@goodybag.com",
			                    "name": "payments@goodybag.com",
			                    "type": "to"
			                }
			            ],
			            "data": {
			            	"items": JSON.parse(data.attributes.items),
			            	"summary": JSON.parse(data.attributes.summary),
			            	"orderHashId": data.attributes.orderHashId,
			            	"deliveryTime": extraInfo.deliveryTime,
			            	"deliverLocation": extraInfo.deliverLocation,
			            	"itemsByDay": extraInfo.itemsByDay
			            }
			        }).fail(function (err) {
						console.error("Error sending receipt:", err.stack);
					});

					return Q.resolve();
				}

				// NOTE: We do this first before charging the card in case there are any errors.
				return groupItemsByDayAndResolve(data).then(function (extraInfo) {

					return chargeCard(data).then(function (paymentCharge) {

						// Now that the card is charged the order insertion is EXPECTED to work.
						// TODO: Re-schedule order insertion if it fails.
						return storeOrder(data, paymentCharge).then(function (resp) {

							// NOTE: We do NOT wait for notifications to be sent.
							sendNotifications(data, extraInfo).fail(function (err) {

								console.error("Error sending notifications but ignoring:", err.stack);
								// TODO: Inform user of error.
							});

							return resp;
						});
					});
				});

	/*
						SERVICES.cater.sendPayment({
			                // Goodybag Restaurant ID whose account will be credited
			                restaurant_id: vendor_id,
			                // Stripe Customer Object/Identifier
	// TODO: Use this once we create customer records.
			                customer: "",
			                // Stripe Credit Card Object/Identifier
			                source: paymentToken.card.id,
			                // Amount to be charged in cents before Tax and optional service_fee
			                amount: summary.amount,
			                // Amount in cents on top of base `amount` - all funds go to Goodybag account
			                service_fee: (summary.total - summary.amount),
			                // Arbitrary object to attach to transaction
			                metadata: JSON.stringify(data.attributes),
			                // What will show up on bank statement
	// TODO: Where does this come from?
			                statement_descriptor: ""

						}, request).fail(function (err) {
							console.error("Error sending receipt:", err.stack);
						});
	*/

			} catch (err) {
				throw err;
			}
		}).then(resolve, function (err) {

			// TODO: Schedule work to re-run at a later point in time?
			console.error("Error charging and saving order!", err.stack);

			return reject(err);
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

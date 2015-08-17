
var PATH = require("path");
var API = require("../../server/db/api.endpoints");
var ENDPOINTS = require('endpoints');
var EXTEND = require("extend");
var UUID = require("uuid");
var Q = require("q");
var STRIPE = require("stripe");

var SERVICES = require("../../server/services");
var DB = require("../../server/db/bookshelf.knex.postgresql");


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

store.update = function (model, params, request) {

	return SERVICES['for']({}).then(function (SERVICES) {

		return ENDPOINTS.Store.bookshelf.update.call(store, model, params).then(function (resp) {

			try {

				if (resp.attributes['paymentToken']) {

					var form = JSON.parse(resp.attributes.form);
					var event = JSON.parse(resp.attributes.event);

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
			            	"orderHashId": resp.attributes.orderHashId,
			            	"orderFrom": resp.attributes.orderFrom,
			            	"deliveryDate": event["format.deliveryDate"],
			            	"deliveryTime": event["format.deliveryTime"],
			            	"deliverLocation": event["consumerGroup.deliverLocation"]
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
			            	"items": JSON.parse(resp.attributes.items),
			            	"summary": JSON.parse(resp.attributes.summary),
			            	"orderHashId": resp.attributes.orderHashId,
			            	"orderFrom": resp.attributes.orderFrom,
			            	"deliveryDate": event["format.deliveryDate"],
			            	"deliveryTime": event["format.deliveryTime"],
			            	"deliverLocation": event["consumerGroup.deliverLocation"]
			            }
			        }).fail(function (err) {
						console.error("Error sending receipt:", err.stack);
					});


					/*
					resp.attributes = { id: '50',
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
//console.log("resp.attributes", resp.attributes);

					var referenceCode = resp.attributes.orderHashId.substring(0, 7).toUpperCase();
					var paymentToken = JSON.parse(resp.attributes.paymentToken);
					var vendor_id = parseInt(resp.attributes.vendor_ids);
					if (!vendor_id) {
						// TODO: Look at items and split up order for different vendors.
						console.error("Error getting 'restaurant_id' from 'vendor_ids'. Looks like there were two vendors involved and e don't support that yet.");
					}
					var summary = JSON.parse(resp.attributes.summary);


					Q.denodeify(function (callback) {
						var stripe = STRIPE("sk_live_kjAFUHK2tYc6BRHRyeMlZPON");
//						var stripe = STRIPE(request._FireNodeContext.config.stripeSecretKey);
						var payload = {
//							amount: summary.amount,
							amount: summary.total,
							currency: "usd",
							metadata: {
								orderHashId: resp.attributes.orderHashId,
								email: form["info[email]"]
							},
							capture: true,
							source: paymentToken.id,
							description: "Lunchroom charge for order '" + referenceCode + "'"
						};
						console.log("Posting to stripe:", JSON.stringify(payload, null, 4));
						stripe.charges.create(payload, function (err, paymentCharge) {
							if (err) return callback(err);

							return DB.getKnex()('orders').update({
								paymentCharge: JSON.stringify(paymentCharge)
							}).where("id", resp.attributes.id);
						});
					})().fail(function (err) {

// TODO: Repeat on non-fatal error.
						console.error("Error charging card:", err.stack);
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
		                metadata: JSON.stringify(resp.attributes),
		                // What will show up on bank statement
// TODO: Where does this come from?
		                statement_descriptor: ""

					}, request).fail(function (err) {
						console.error("Error sending receipt:", err.stack);
					});
*/
				}

			} catch (err) {
				// TODO: Schedule work to re-run at a later point in time.
				console.error("Error doing extra work after update!", err.stack);
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

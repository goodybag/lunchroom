
const DEV = false;

var SERVICES = require("./services");

SERVICES['for']({}).then(function (_SERVICES) {
	SERVICES = _SERVICES;
});


require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.monitorDatabase = function (db) {


    	function sendMenuForEventTo (menuData, subscribers) {

			function sendEmails () {

	    		if (!subscribers) {
	    			console.log("No subscribers");
	    			return API.Q.resolve();
	    		}

				return API.Q.all(Object.keys(subscribers).map(function (email) {

					console.log("Sending menu to:", email);

					return SERVICES.email.send("Menu", {
			            "to": [
			                {
			                    "email": email,
			                    "name": email,
			                    "type": "to"
			                }
			            ],
			            "data": {
			            	"menu": {
			            		"url": menuData.event.get("menuUrl"),
// TODO: Make this dynamic!
			            		"restaurantName": "Trudy's"
			            	},
			            	"items": Object.keys(menuData.items).map(function (itemId) {
								return menuData.items[itemId];
							})
			            }
			        }).fail(function (err) {
						console.error("Error sending email but ignoring", err.stack);
						// TODO: Resend email
					});
				}));
			}

			function setMenuEmailsSent () {
				return API.Q.when(db.knex('events').update({
					'menuEmailsSent': true
				}).where({
					'id': menuData.event.get("id")
				}).then(function (result) {
					// TODO: Check `result == 1`
				})).then(function () {
					// TODO: Use transactions instead of waiting to ensure out update goes
					//       through before the enxt job cycle?
					return API.Q.delay(15 * 1000);
				});
			}

			return sendEmails().then(function () {

				console.log("All emails sent!");

				return setMenuEmailsSent();
			});
    	}


    	function sendDeliveredEmailsForEventTo (eventData, ordersData) {

			function sendEmails () {

				return API.Q.all(Object.keys(ordersData).map(function (orderId) {

					console.log("Sending delivered email to:", ordersData[orderId].email);

					return SERVICES.email.send("Order_Arrived", {
			            "to": [
			                {
			                    "email": ordersData[orderId].email,
			                    "name": ordersData[orderId].name || ordersData[orderId].email,
			                    "type": "to"
			                }
			            ],
			            "data": {
			            	"orderHashId": ordersData[orderId].orderHashId,
			            	"event": {
			            		"pickupLocation": ordersData[orderId].pickupLocation
			            	}
			            }
			        }).fail(function (err) {
						console.error("Error sending email but ignoring", err.stack);
						// TODO: Resend email
					});
				}));
			}

			function sendSMSs () {

				return API.Q.all(Object.keys(ordersData).map(function (orderId) {

					if (!ordersData[orderId].phone) return API.Q.resolve();

					console.log("Sending delivered SMS to:", ordersData[orderId].phone);

					return SERVICES.sms.send("Order_Arrived", {
			            "to": ordersData[orderId].phone,
			            "data": {
			            	"event": {
			            		"pickupLocation": ordersData[orderId].pickupLocation
			            	}
			            }
			        }).fail(function (err) {
						console.error("Error sending SMS but ignoring", err.stack);
					// TODO: Resend email
					});
				}));
			}

			function setDeliveredEmailsSent () {
				return API.Q.when(db.knex('events').update({
					'deliveredEmailsSent': true
				}).where({
					'id': eventData.get("id")
				}).then(function (result) {
					// TODO: Check `result == 1`
				})).then(function () {
					// TODO: Use transactions instead of waiting to ensure out update goes
					//       through before the enxt job cycle?
					return API.Q.delay(15 * 1000);
				});
			}

			return sendEmails().then(function () {

				return sendSMSs().then(function () {

					console.log("All emails and sendSMSs sent!");

					return setDeliveredEmailsSent();
				});
			});
    	}



    	function iterate () {

	    	function fetchPendingEvents (type) {

	    		var EventsModel = require("../stores/ui.Events.model").forContext({
	    			appContext: API.appContext
	    		});

	    		// Find all events for today for which the notifications
	    		// have not yet gone out.
	    		var query = db.knex('events');

	    		if (type === "menus") {
	    			query = query.where({
						'menuReady': true,
						'menuEmailsSent': false
					}).whereBetween('orderByTime', [
						API.MOMENT_TZ().tz("America/Chicago").second(0).minute(0).hour(0).format(),
						API.MOMENT_TZ().tz("America/Chicago").second(0).minute(0).hour(0).add(1, 'day').format()
					]);
	    		} else
	    		if (type === "deliveries") {
	    			query = query.where({
						'menuReady': true,
						'delivered': true,
						'deliveredEmailsSent': false
					});
					//.whereBetween('deliveryStartTime', [
					//	API.MOMENT_TZ().tz("America/Chicago").format(),
					//	API.MOMENT_TZ().tz("America/Chicago").add(1, 'day').format()
					//]);
	    		} else {
	    			throw new Error("Unknown type '" + type + "'!");
	    		}

				return API.Q.when(query.then(function (result) {
					var events = {};
					result.forEach(function (row) {
						events[row.id] = new EventsModel(row);
					});
					return events;
				}));
	    	}

	    	function fetchMenus(event_ids) {
				return API.Q.when(db.knex('menus').whereIn('event_id', event_ids).then(function (result) {
					var menus = {};
					result.forEach(function (row) {
						if (!menus[row.event_id]) {
							menus[row.event_id] = {
								items: {}
							};
						}
						menus[row.event_id].items[row.item_id] = null;
					});
					return menus;
				}));
	    	}

	    	function augmentMenusWithItems (menus) {
	    		var ids = {};
	    		for (var event_id in menus) {
	    			Object.keys(menus[event_id].items).forEach(function (item_id) {
		    			ids[item_id] = event_id;
	    			});
	    		}
				return API.Q.when(db.knex('items').whereIn('id', Object.keys(ids)).then(function (result) {
					result.forEach(function (row) {
						menus[ids[row.id]].items[row.id] = row;
					});
				}));
	    	}

	    	function fetchSubscribers (events) {
	    		var ids = {
	    			consumerGroup: {},
	    			event: {}
	    		};
	    		for (var event_id in events) {
	    			ids.event[event_id] = true;
	    			ids.consumerGroup[events[event_id].get("consumer_group_id")] = true;
	    		}
				return API.Q.when(db.knex('consumer-group-subscriptions')
					.select(
						'consumer-group-subscriptions.id',
						'consumer-group-subscriptions.confirmedEmail AS email',
						'events.id AS event_id'
					)
					.rightJoin('events', 'consumer-group-subscriptions.consumer_group_id', 'events.consumer_group_id')
					.whereIn('consumer-group-subscriptions.consumer_group_id', Object.keys(ids.consumerGroup))
					.whereIn('events.id', Object.keys(ids.event))
					.whereNotNull('consumer-group-subscriptions.confirmedEmail')
				.then(function (result) {
					var subscribers = {};
					result.forEach(function (row) {
						if (!subscribers[row.event_id]) {
							subscribers[row.event_id] = {};
						}
						subscribers[row.event_id][row.email] = true;
					});
					return subscribers;
				}));
	    	}


	    	function sendMenuEmails () {

	    		// We send emails out after 9 am CT (America/Chicago).
	    		if (API.MOMENT_TZ().tz("America/Chicago").isBefore(
		    		API.MOMENT_TZ().tz("America/Chicago").second(0).minute(0).hour(9)
	    		)) {
	    			console.log("It is not yet 9am CT so we don't yet check to see if we need to send menu emails for today!");
					return API.Q.resolve();
	    		};

				return fetchPendingEvents("menus").then(function (events) {

					var eventIds = Object.keys(events);

					if (eventIds.length === 0) {
						// No new pending events.
						return;
					}

		    		return fetchMenus(eventIds).then(function (menus) {

						return augmentMenusWithItems(menus).then(function () {

							return fetchSubscribers(events).then(function (subscribers) {

								var done = API.Q.resolve();

								for (var eventId in events) {
									done = API.Q.when(done, function () {
										return sendMenuForEventTo({
											event: events[eventId],
											items: menus[eventId].items
										}, subscribers[eventId]);
									});
								}

								return done;
							});
						});
		    		});
		    	});
	    	}


			function fetchOrders (eventIds) {
				return API.Q.when(db.knex('orders')
					.select('id', 'event_id', 'form', 'event', 'orderHashId')
					.whereIn('event_id', eventIds)
				.then(function (result) {
					var orders = {};
					result.forEach(function (row) {
						if (!orders[row.event_id]) {
							orders[row.event_id] = {};
						}
						try {
							var form = JSON.parse(row.form);
							var event = JSON.parse(row.event);
							orders[row.event_id][row.id] = {
								name: form['info[name]'],
								email: form['info[email]'],
								phone: form['info[phone]'],
								pickupLocation: event["consumerGroup.pickupLocation"],
								orderHashId: row.orderHashId
							}
						} catch (err) {
							console.error("Ignoring error:", err.stack);
						}
					});
					return orders;
				}));
	    	}

	    	function sendStatusEmails () {

				return fetchPendingEvents("deliveries").then(function (events) {

					var eventIds = Object.keys(events);

					if (eventIds.length === 0) {
						// No new pending events.
						return;
					}

					return fetchOrders(eventIds).then(function (orders) {
						return API.Q.all(Object.keys(events).map(function (eventId) {
							
							return sendDeliveredEmailsForEventTo(
								events[eventId],
								orders[eventId]
							);
						}));
					});
				});
	    	}


	    	return sendMenuEmails().then(function () {

				return sendStatusEmails();
	    	});
	    }

	    setInterval(function () {

		    iterate().fail(function (err) {
		    	console.error("Error monitoring database", err.stack);
		    });

	    }, (DEV ? 2 : 60) * 1000);
    }

});

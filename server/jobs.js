
const DEV = false;

var SERVICES = require("./services");
var EMAILS = require("./emails");


SERVICES['for']({}).then(function (_SERVICES) {
	SERVICES = _SERVICES;
});

const Q = require("q");


// TODO: Make this generic and use RX
var loadMenuDataForEvents = exports.loadMenuDataForEvents = function (knex, appContext, eventIds) {

	var EventsModel = require("../stores/ui.Events.model").forContext({
		appContext: appContext
	});

	var ItemsModel = require("../stores/ui.Items.model").forContext({
		appContext: appContext
	});

	var VendorsModel = require("../stores/ui.Vendors.model").forContext({
		appContext: appContext
	});

	var ConsumerGroupsModel = require("../stores/ui.ConsumerGroups.model").forContext({
		appContext: appContext
	});

	function fetchMenus(event_ids) {

		var menus = {
			vendorIds: {},
			consumerGroupIds: {},
			vendors: {},
			consumerGroups: {},
			events: {}
		};

		return Q.when(knex('events').whereIn('id', event_ids).then(function (result) {

			result.forEach(function (row) {
				if (!menus.events[row.id]) {
					menus.events[row.id] = {
						event: {},
						items: {}
					};
				}
				menus.consumerGroupIds[row.consumer_group_id] = true;
				menus.events[row.id].event = new EventsModel(row);
			});

			return Q.when(knex('menus').whereIn('event_id', event_ids).then(function (result) {

				result.forEach(function (row) {
					menus.events[row.event_id].items[row.item_id] = null;
				});

				return menus;
			}));
		}));
	}

	function augmentMenusWithItems (menus) {
		var ids = {};
		for (var event_id in menus.events) {
			Object.keys(menus.events[event_id].items).forEach(function (item_id) {
    			ids[item_id] = event_id;
			});
		}
		return Q.when(knex('items').whereIn('id', Object.keys(ids)).then(function (result) {
			result.forEach(function (row) {
				menus.vendorIds[row.vendor_id] = true;
				menus.events[ids[row.id]].items[row.id] = new ItemsModel(row);
			});
		}));
	}

	function fetchVendors (menus) {
		return Q.when(knex('vendors').whereIn('id', Object.keys(menus.vendorIds)).then(function (result) {
			result.forEach(function (row) {
				menus.vendors[row.id] = new VendorsModel(row);
			});
		}));
	}

	function fetchConsumerGroup (menus) {
		return Q.when(knex('consumer-groups').whereIn('id', Object.keys(menus.consumerGroupIds)).then(function (result) {
			result.forEach(function (row) {
				menus.consumerGroups[row.id] = new ConsumerGroupsModel(row);
			});
		}));
	}

	return fetchMenus(eventIds).then(function (menus) {

		return augmentMenusWithItems(menus).then(function () {

			return fetchVendors(menus).then(function () {

				return fetchConsumerGroup(menus);
			});

		}).then(function () {
			return menus;			
		});
	});
}




require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.monitorDatabase = function (db, appContext) {


		var ConsumerGroupSubscriptionsModel = require("../stores/ui.ConsumerGroupSubscriptions.model").forContext({
			appContext: appContext
		});


    	var MOMENT = appContext.MOMENT;
    	var MOMENT_CT = appContext.MOMENT_CT;

    	function qknex (tableName, query) {
    		if (typeof query === "undefined" && typeof tableName === "function") {
    			query = tableName;
    			tableName = null;
    		}
    		return API.Q.fcall(function () {
    			var table = ((tableName) ? db.knex(tableName) : db.knex);
    			return query(table).then(function (resp) {

console.log("RESPONSE:", resp);

    				return resp;
    			}).catch(function (err) {
    				throw err;
    			});
    		});
    	}

    	function sendMenuForEventTo (menus, eventId, subscribers) {

			function sendEmails () {

	    		if (!subscribers) {
	    			console.log("No subscribers");
	    			return API.Q.resolve();
	    		}

				return EMAILS.for({
					args: {
						appContext: API.appContext
					}
				}).then(function (EMAILS) {

					return API.Q.all(Object.keys(subscribers).map(function (email) {

// TODO: Track send status in consolidated subscriber record.
// TODO: Consolidate subscriber records prior to scheduling emails for day.

//menuEmailSent
//menuSmsSent
//menuEmailSendError
//menuSmsSendError

						return EMAILS.renderEmail("menu", {
							menus: menus,
							event_id: eventId,
							subscription: subscribers[email]
						}).then(function (html) {

							try {

								console.log("Sending menu to:", email);

								var event = menus.events[eventId].event;
								// Assume only one vendor.
								var vendor = menus.vendors[Object.keys(menus.vendors).shift()];

								var subscription = subscribers[email];

								return SERVICES.email.send("Menu", {
						            "to": [
						                {
						                    "email": email,
						                    "name": email,
						                    "type": "to"
						                }
						            ],
						            "data": {
						            	"subscription": {
						            		"unsubscribeUrl": subscription.get("unsubscribeUrl")
						            	},
						            	"menu": {
											restaurantName: vendor.get('title'),
											lunchroomUrl: event.get("menuUrl"),
											orderByTime: event.get("format.orderByTime")
						            	},
						            	"items": Object.keys(menus.events[eventId].items).map(function (itemId) {
											return menus.events[eventId].items[itemId].getValues();
										})
						            },
						            "html": html
						        }).fail(function (err) {
						        	throw err;
								});
							} catch (err) {
								console.error("Error sending email but ignoring", err.stack);
								// TODO: Resend email
							}
						});
					}));
				});
			}

			function setMenuEmailsSent () {
				return qknex('events', function (table) {
					return table.update({
						'menuEmailsSent': true
					}).where('id', eventId);
				}).then(function () {
					// TODO: Still need this now that errors are caught properly?
					return API.Q.delay(15 * 1000);
				});
			}

			return sendEmails().then(function () {

				console.log("All emails sent!");

				return setMenuEmailsSent();
			});
    	}


    	function sendDeliveredEmailsForEventTo (eventId, ordersData) {

			var orderIds = Object.keys(ordersData);
			var itemIds = [];
			orderIds.forEach(function (orderId) {
				ordersData[orderId].items.forEach(function (item) {
					itemIds.push(item.id);
				});
			});


			function sendEmails () {

				// NOTE: We mark emails as sent because if it errors out we assume it
				//       was sent anyway.
				// TODO: To re-send an email, there should be a script
				//       that monitors the 'deliveredEmailSendError'
				//       field and resets the 'deliveredEmailSent' field if the email
				//       service was down. The 'deliveredEmailsSent' flag on the event
				//       table should not be set until all emails have been
				//       attempted to be sent/re-sent to a satisfactory tenacity.

				return qknex('order-items', function (table) {
					return table.update({
						'deliveredEmailSent': true
					}).whereIn('id', itemIds);
				}).fail(function (err) {
					console.error("ERROR", err.stack);
					console.error("ERROR setting 'deliveredEmailSent' on 'order-items' table. We abort completely and let the next loop try again");
					throw err;
				}).then(function () {

					// It is assumed that 'deliveredEmailsSent' is now set for the order-items
					// we are about to send notifications for. So if anything breaks for now on
					// the emails will not be re-sent unless the 'deliveredEmailSendError' flag is reset.

					return API.Q.all(orderIds.map(function (orderId) {

						// If any item was already indicated as sent we don't send another one.
						var alreadySent = false;
						ordersData[orderId].items.forEach(function (item) {
							if (item.deliveredEmailSent) {
								alreadySent = true;
							}
						});
						if (alreadySent) {
							console.log("SKIP: Sending delivered email to:", ordersData[orderId].email, "(already sent based on 'deliveredEmailSent')");
							return API.Q.resolve();
						}

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

							console.error("Error sending email to '" + ordersData[orderId].email + "' but ignoring:", err.stack);

							return qknex('order-items', function (table) {
								return table.update({
									'deliveredEmailSendError': err.message
								}).where('id', itemIds);
							}).fail(function (err) {
								console.error("ERROR", err.stack);
								console.error("ERROR setting 'deliveredEmailSendError' on 'order-items' table. We ignore error so the other emails still go out since we already flagged them has having gone out.");
							});
						});
					}));

				});
			}

			function sendSMSs () {

				// NOTE: Same logic as documented in 'sendEmails' above.

				return qknex('order-items', function (table) {
					return table.update({
						'deliveredSmsSent': true
					}).whereIn('id', itemIds);
				}).fail(function (err) {
					console.error("ERROR", err.stack);
					console.error("ERROR setting 'deliveredSmsSent' on 'order-items' table. We abort completely and let the next loop try again");
					throw err;
				}).then(function () {

					return API.Q.all(orderIds.map(function (orderId) {

						if (!ordersData[orderId].phone) {
							console.log("SKIP: Sending delivered sms to:", ordersData[orderId].phone, "(no 'phone' specified)");
							return API.Q.resolve();
						}

						// If any item was already indicated as sent we don't send another one.
						var alreadySent = false;
						ordersData[orderId].items.forEach(function (item) {
							if (item.deliveredSmsSent) {
								alreadySent = true;
							}
						});
						if (alreadySent) {
							console.log("SKIP: Sending delivered sms to:", ordersData[orderId].phone, "(already sent based on 'deliveredEmailSent')");
							return API.Q.resolve();
						}

						console.log("Sending delivered sms to:", ordersData[orderId].phone);

						return SERVICES.sms.send("Order_Arrived", {
				            "to": ordersData[orderId].phone,
				            "data": {
				            	"event": {
				            		"pickupLocation": ordersData[orderId].pickupLocation
				            	}
				            }
				        }).fail(function (err) {

							console.error("Error sending sms to '" + ordersData[orderId].phone + "' but ignoring:", err.stack);

							return qknex('order-items', function (table) {
								return table.update({
									'deliveredSmsSendError': err.message
								}).where('id', itemIds);
							}).fail(function (err) {
								console.error("ERROR", err.stack);
								console.error("ERROR setting 'deliveredSmsSendError' on 'order-items' table. We ignore error so the other smss still go out since we already flagged them has having gone out.");
							});
						});
					}));
				});
			}

			function setDeliveredEmailsSent () {
				return qknex('events', function (table) {
					return table.update({
						'deliveredEmailsSent': true
					}).where('id', eventId);
				}).then(function () {
					// TODO: Still need this now that errors are caught properly?
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

//	menuEmailSendError
//	menuEmailSent
//	menuSmsSent
//	menuSmsSendError

	    	function fetchPendingEvents (type) {

				return qknex('events', function (table) {

					// Find all events for today for which the notifications
		    		// have not yet gone out.
		    		var query = table.select('id');

		    		if (type === "menus") {

console.log("Day ID", MOMENT_CT().format("YYYY-MM-DD"));
console.log("NOW to compare menuEmailTime", MOMENT().format());

		    			query = query.where({
                            'deleted': false,
							'menuReady': true,
							'menuEmailsSent': false
						})
						.where('day_id', MOMENT_CT().format("YYYY-MM-DD"))
						//whereBetween('orderByTime', [
						//	MOMENT().second(0).minute(0).hour(0).format(),
						//	MOMENT().second(0).minute(0).hour(0).add(1, 'day').format()
						//])
						.where('menuEmailTime', '<', MOMENT().format())
		    		} else
		    		if (type === "deliveries") {
		    			query = query.where({
                            'deleted': false,
							'menuReady': true,
							'delivered': true,
							'deliveredEmailsSent': false
						});
						//.whereBetween('deliveryStartTime', [
						//	MOMENT().format(),
						//	MOMENT().add(1, 'day').format()
						//]);
		    		} else {
		    			throw new Error("Unknown type '" + type + "'!");
		    		}

					return query;
				}).then(function (result) {
					var events = {};
					result.forEach(function (row) {
						events[row.id] = true;
					});
					return events;
				});
	    	}

	    	function fetchSubscribers (menus) {
				return qknex('consumer-group-subscriptions', function (table) {
					// TODO: Only include latest subscriber record and only if active.
					return table.select(
						'consumer-group-subscriptions.*',
						'events.id AS event_id'
					)
					.rightJoin('events', 'consumer-group-subscriptions.consumer_group_id', 'events.consumer_group_id')
					.whereIn('consumer-group-subscriptions.consumer_group_id', Object.keys(menus.consumerGroupIds))
					.whereIn('events.id', Object.keys(menus.events))
					.whereNotNull('consumer-group-subscriptions.confirmedEmail')
					.orderBy('consumer-group-subscriptions.id', 'desc');
				}).then(function (result) {

					var inactive = {};

					var subscribers = {};
					result.forEach(function (row) {
						if (!subscribers[row.event_id]) {
							subscribers[row.event_id] = {};
						}
						if (
							!subscribers[row.event_id][row.confirmedEmail] &&
							!inactive[row.confirmedEmail]
						) {
							if (row.active) {
								subscribers[row.event_id][row.confirmedEmail] = new ConsumerGroupSubscriptionsModel(row);
							} else {
								inactive[row.confirmedEmail] = true;
							}
						}
					});

//console.log("subscribers", subscribers);

					return subscribers;
				});
	    	}


	    	function sendMenuEmails () {

console.log("NOW", MOMENT_CT().format());
console.log("CHECK AGAINST", MOMENT_CT().second(0).minute(0).hour(8).format());

	    		// We NEVER send emails out before 8 am CT (America/Chicago).
	    		// NOTE: We use the 'menuEmailTime' field to set the exact time.
	    		if (MOMENT_CT().isBefore(
		    		MOMENT_CT().second(0).minute(0).hour(8)
	    		)) {
	    			console.log("It is not yet 8am CT so we don't yet check to see if we need to send menu emails for today!");
					return API.Q.resolve();
	    		};

				return fetchPendingEvents("menus").then(function (events) {

					var eventIds = Object.keys(events);

					if (eventIds.length === 0) {
						// No new pending events.
						return;
					}

					return loadMenuDataForEvents(db.knex, API.appContext, eventIds).then(function (menus) {

						return fetchSubscribers(menus).then(function (subscribers) {

							var done = API.Q.resolve();

							for (var eventId in menus.events) {
								done = API.Q.when(done, function () {
									return sendMenuForEventTo(menus, eventId, subscribers[eventId]);
								});
							}

							return done;
						});
		    		});
		    	});
	    	}


			function fetchOrderItems (eventIds) {
				return qknex('order-items', function (table) {
					return table.select(
						'id',
						'day_id',
						'order_id',
						'event_id',
						'vendor_id',
						'options',
						'deliveredEmailSent',
						'deliveredSmsSent'
					)
					.whereIn('event_id', eventIds);
				}).then(function (result) {
					var orders = {};
					var orderIds = {};
					var vendorIds = {};
					result.forEach(function (row) {
						if (!orders[row.event_id]) {
							orders[row.event_id] = {};
						}
						if (!orders[row.event_id][row.order_id]) {
							orders[row.event_id][row.order_id] = {
								items: []
							};
						}
						if (!orderIds[row.order_id]) {
							orderIds[row.order_id] = [];
						}
						orderIds[row.order_id].push(row.event_id);
						vendorIds[row.vendor_id] = true;
						orders[row.event_id][row.order_id].items.push(row);
					});

					return qknex('orders', function (table) {
						return table.whereIn('id', Object.keys(orderIds));
					}).then(function (result) {
						result.forEach(function (row) {
							orderIds[row.id].forEach(function (eventId) {
								try {
									var form = JSON.parse(row.form);
									orders[eventId][row.id].name = form['info[name]'];
									orders[eventId][row.id].email = form['info[email]'];
									orders[eventId][row.id].phone = form['info[phone]'];
									orders[eventId][row.id].orderHashId = row.orderHashId;
								} catch (err) {
									console.error("Got error but ignoring:", err.stack);
								}
							});
						});

						return qknex('events', function (table) {
							return table.select(
								'id',
								'consumer_group_id'
							).whereIn('id', eventIds);
						}).then(function (result) {
							var consumerGroupsForEvents = {};
							var consumerGroupIds = {};
							result.forEach(function (row) {
								consumerGroupsForEvents[row.id] = row.consumer_group_id;
								consumerGroupIds[row.consumer_group_id] = true;
							});

							return qknex('consumer-groups', function (table) {
								return table.select(
									'id',
									'pickupLocation'
								).whereIn('id', Object.keys(consumerGroupIds));
							}).then(function (result) {
								var pickupLocations = {};
								result.forEach(function (row) {
									pickupLocations[row.id] = row.pickupLocation;
								});

								Object.keys(orders).forEach(function (eventId) {
									Object.keys(orders[eventId]).forEach(function (orderId) {
										orders[eventId][orderId].pickupLocation = pickupLocations[
											consumerGroupsForEvents[eventId]
										];
									});
								});

								return orders;
							});
						});
					});
				});
	    	}

	    	function sendStatusEmails () {

				return fetchPendingEvents("deliveries").then(function (events) {

					var eventIds = Object.keys(events);

					if (eventIds.length === 0) {
						// No new pending events.
						return;
					}

					return fetchOrderItems(eventIds).then(function (orderItems) {

						return API.Q.all(Object.keys(events).map(function (eventId) {

							if (!orderItems[eventId]) return API.Q.resolve();

							return sendDeliveredEmailsForEventTo(
								eventId,
								orderItems[eventId]
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

	    }, (DEV ? 5 : 60) * 1000);
    }

});

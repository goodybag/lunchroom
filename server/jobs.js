
const DEV = true;

var SERVICES = require("./services");

SERVICES['for']({}).then(function (_SERVICES) {
	SERVICES = _SERVICES;
});


require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.monitorDatabase = function (db) {


    	function sendMenuForEventTo (menuData, subscribers) {

			function sendEmails () {

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
			            		"url": menuData.event.get("menuUrl")
			            	},
			            	"items": Object.keys(menuData.items).map(function (itemId) {
								return menuData.items[itemId];
							})
			            }
			        }).then(function () {

						console.log("Email sent!");

					}).fail(function (err) {
						console.error("Error sending email but ignoring", err.stack);
						// TODO: Resend email
					});
				}));
			}

			function setNotificationsSent () {
				return API.Q.when(db.knex('events').update({
					'notificationsSent': true
				}).where({
					'id': menuData.event.get("id")
				}).then(function (result) {
					// TODO: Check `result == 1`
				})).then(function () {
					// TODO: Use transactions instead of waiting to ensure out update goes
					//       through before the enxt job cycle.
					return API.Q.delay(5 * 1000);
				});
			}

			return sendEmails().then(function () {

				return setNotificationsSent();
			});
    	}


    	function iterate () {

	    	function fetchPendingEvents () {

	    		var EventsModel = require("../stores/ui.Events.model").forContext({
	    			appContext: API.appContext
	    		});

	    		// Find all events for today for which the notifications
	    		// have not yet gone out.

				return API.Q.when(db.knex('events').where({
					'notificationsSent': false,
					'menuReady': true
				}).whereBetween('orderByTime', [
					API.MOMENT().second(0).minute(0).hour(0).format(),
					API.MOMENT().second(0).minute(0).hour(0).add(1, 'day').format()
				]).then(function (result) {
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

	    	return fetchPendingEvents().then(function (events) {

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

	    setInterval(function () {

		    iterate().fail(function (err) {
		    	console.error("Error monitoring database", err.stack);
		    });

	    }, (DEV ? 2 : 60) * 1000);
    }

});

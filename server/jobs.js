
require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.monitorDatabase = function (db) {

    	function iterate () {

	    	function fetchPendingEvents () {

	    		// Find all events for today for which the notifications
	    		// have not yet gone out.

				return API.Q.when(db.knex('events').select(
					'id',
					'consumer_group_id'
				).where({
					'notificationsSent': false,
					'menuReady': true
				}).whereBetween('orderByTime', [
					API.MOMENT().second(0).minute(0).hour(0).format(),
					API.MOMENT().second(0).minute(0).hour(0).add(1, 'day').format()
				]).then(function (result) {
					var events = {};
					result.forEach(function (row) {
						events[row.id] = row;
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
	    		var ids = {};
	    		for (var event_id in events) {
	    			ids[events[event_id].consumer_group_id] = true;
	    		}
				return API.Q.when(db.knex('consumer-group-subscriptions')
					  .join('events', 'consumer-group-subscriptions.consumer_group_id', '=', 'events.consumer_group_id')
					  .select(
					  	'consumer-group-subscriptions.id',
					  	'consumer-group-subscriptions.confirmedEmail AS email',
					  	'events.id AS event_id'
					  )
				.then(function (result) {
					var subscribers = {};
					result.forEach(function (row) {
						if (!subscribers[row.event_id]) {
							subscribers[row.event_id] = {};
						}
						subscribers[row.event_id][row.id] = row.email;
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

console.log("found events", events);
console.log("found menus", menus);
console.log("found subscribers", subscribers);

						});
					});
	    		});
	    	});

	    }

	    setInterval(function () {

		    iterate().fail(function (err) {
		    	console.error("Error monitoring database", err.stack);
		    });

	    }, 2 * 1000);
    }

});

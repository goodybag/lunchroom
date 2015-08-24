
const MOMENT = require("moment");
const MOMENT_TZ = require("moment-timezone");
const LODASH = require("lodash");


exports['for'] = function (API) {

	var DB = require("../../server/db/bookshelf.knex.postgresql");

	var qknex = DB.getQKnex();


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		var session = req._FireNodeContext.session;

		// For event email we just load the event id
		if (
			req._FireNodeContext.config.type === "email" &&
			opts.arg
		) {
			return qknex('events', function (table) {
				return table
					.where({
						"token": opts.arg
					}).select(
						'id',
						'consumer_group_id'
					);
			}).then(function (result) {

				if (result.length === 0) {
					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/"
						}
					});
					return false;
				}

				req._FireNodeContext.addLayer({
					session: {
						dbfilter: {
							event_id: result[0].id,
							consumer_group_id: result[0].consumer_group_id
						}
					}
				});

				return false;
			});
		}

/*
		if (
			session &&
			session.dbfilter &&
			session.dbfilter.event_id && 
			session.dbfilter.consumer_group_id && 
			!opts.arg
		) {

			// Redirect to alias url for consumer group.

			return DB.getKnex()('events').where({
				"id": session.dbfilter.event_id
			}).select('token').then(function (result) {

				if (result.length === 0) {
					// This should not happen but just in case.
					req._FireNodeContext.resetSession();
					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/"
						}
					});
					return false;
				}

				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/event-" + result[0].token
					}
				});
				return false;
			});

			return false;
		}
*/
		return qknex('events', function (table) {
			return table
				.where({
					"token": opts.arg
				}).select(
					'id',
					'consumer_group_id'
				);
		}).then(function (result) {

			if (result.length === 0) {
				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/"
					}
				});
				return false;
			}

			// Now that we have the consumer group we find today's event.

			return loadDataForConsumerGroup(DB, opts.context, result[0].consumer_group_id).then(function (data) {


	console.log("Lookup event for", {
		"day_id": MOMENT_TZ.tz("America/Chicago").format("YYYY-MM-DD"),
		"consumer_group_id": result[0].consumer_group_id
	});

				return qknex('events', function (table) {
					return table
						.where({
							"day_id": MOMENT_TZ.tz("America/Chicago").format("YYYY-MM-DD"),
							"consumer_group_id": result[0].consumer_group_id
						})
						.select('id');
				}).then(function (result2) {

					if (result2.length === 0) {
						req._FireNodeContext.addLayer({
							config: {
								externalRedirect: "/"
							}
						});
						return false;
					}


					req._FireNodeContext.addLayer({
						session: {
							dbfilter: {
								event_id: result2[0].id,
								consumer_group_id: result[0].consumer_group_id
							}
						},
						data: data
					});

					return false;

				});

			});
		});
	}

	return exports;
}





function loadDataForConsumerGroup (DB, context, consumer_group_id) {

	var qknex = DB.getQKnex();

	var DaysModel = require("../ui.Days.model").forContext(context);


	function loadConsumerGroup (consumer_group_id) {
		return qknex('consumer-groups', function (table) {
			return table
				.where('id', consumer_group_id);
		}).then(function (result) {
			var records = {};
			result.forEach(function (record) {
				records[record.id] = record;
			});
			return records;

		});
	}

	function loadEvents (consumer_group_id, dayIds) {
		return qknex('events', function (table) {
			return table
				.where('consumer_group_id', consumer_group_id)
				.whereIn('day_id', dayIds);
		}).then(function (result) {
			var records = {};
			result.forEach(function (record) {
				records[record.id] = record;
			});
			return records;
		});
	}

	function loadMenus (eventIds) {
		return qknex('menus', function (table) {
			return table
				.whereIn('event_id', eventIds);
		}).then(function (result) {
			var records = {};
			var vendorIds = {};
			var itemIds = {}
			result.forEach(function (record) {
				records[record.id] = record;
				vendorIds[record.vendor_id] = true;
				itemIds[record.item_id] = true;
			});
			return {
				records: records,
				vendorIds: Object.keys(vendorIds),
				itemIds: Object.keys(itemIds)
			};
		});
	}

	function loadItems (itemIds) {
		return qknex('items', function (table) {
			return table
				.whereIn('id', itemIds);
		}).then(function (result) {
			var records = {};
			result.forEach(function (record) {
				records[record.id] = record;
			});
			return records;
		});
	}

	function loadVendors (vendorIds) {
		return qknex('vendors', function (table) {
			return table
				.whereIn('id', vendorIds);
		}).then(function (result) {
			var records = {};
			result.forEach(function (record) {
				records[record.id] = record;
			});
			return records;
		});
	}


	return loadConsumerGroup(
		consumer_group_id
	).then(function (consumerGroups) {

		return loadEvents(
			consumer_group_id,
			LODASH.map(DaysModel.getCurrentDays(), 'id')
		).then(function (events) {

			return loadMenus(
				Object.keys(events)
			).then(function (menuInfo) {

				return loadItems(menuInfo.itemIds).then(function (items) {

					return loadVendors(menuInfo.vendorIds).then(function (vendors) {

						return {
							"consumer-groups": consumerGroups,
							"events": events,
							"menus": menuInfo.records,
							"items": items,
							"vendors": vendors
						};
					});
				});
			});
		});
	});
}


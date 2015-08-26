var console = require("../app/lib/console");


var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {


	var collection = DATA.init({

		name: "order-items",

		model: require("./ui.OrderItems.model").forContext(context),
		record: {
			"@fields": {
				"item_id": {
					"linksTo": "items"
				},
				"event_id": {
					"linksTo": "events"
				},
				"vendor_id": {
					"linksTo": "vendors"
				}
			}
		},

		collection: {			
		},

		store: {

			// Admin: Needed
			loadAllForVendorToday: function (vendor_id) {
				var self = this;

				return COMMON.API.Q.fcall(function () {

					var todayId = context.appContext.get('todayId');

					var deferred = COMMON.API.Q.defer();
					// TODO: Ensure new entries are added to collection
					//       instead of removing all other entries.
					self.fetch({
						reset: false,
						remove: false,
						data: $.param({
							"filter[day_id]": todayId,
							"filter[vendor_id]": vendor_id
						}),
						success: function () {
							return deferred.resolve();
						}
					});
					return deferred.promise;
				});
			},

			// Admin: Needed
			loadAllPlacedToday: function () {
				var self = this;

				function loadItems () {
					return COMMON.API.Q.fcall(function () {

						var todayId = context.appContext.get('todayId');

						var deferred = COMMON.API.Q.defer();
						// TODO: Ensure new entries are added to collection
						//       instead of removing all other entries.
						self.fetch({
							reset: false,
							remove: false,
							data: $.param({
								"filter[placed_day_id]": todayId
							}),
							success: function () {

								var info = {
									eventIds: {},
									vendorIds: {}
								};

								self.where({
									placed_day_id: todayId
								}).forEach(function (record) {
									info.eventIds[record.get("event_id")] = true;
									info.vendorIds[record.get("vendor_id")] = true;
								});

								info.eventIds = Object.keys(info.eventIds);
								info.vendorIds = Object.keys(info.vendorIds);

								return deferred.resolve(info);
							}
						});
						return deferred.promise;
					});
				}

				function loadEvents (eventIds) {
					return COMMON.API.Q.fcall(function () {
						var deferred = COMMON.API.Q.defer();
						// TODO: Ensure new entries are added to collection
						//       instead of removing all other entries.
						context.appContext.get('stores').events.fetch({
							reset: false,
							remove: false,
							data: $.param({
								"filter[id]": eventIds
							}),
							success: function () {				
								return deferred.resolve();
							}
						});
						return deferred.promise;
					});
				}

				function loadVendors (vendorIds) {
					return COMMON.API.Q.fcall(function () {
						var deferred = COMMON.API.Q.defer();
						// TODO: Ensure new entries are added to collection
						//       instead of removing all other entries.
						context.appContext.get('stores').vendors.fetch({
							reset: false,
							remove: false,
							data: $.param({
								"filter[id]": vendorIds
							}),
							success: function () {
								return deferred.resolve();
							}
						});
						return deferred.promise;
					});
				}

				return loadItems().then(function (info) {
					return loadEvents(info.eventIds).then(function () {
						return loadVendors(info.vendorIds);
					});
				});
			}
		}
	});

	return collection.store;
}

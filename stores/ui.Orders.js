
var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {



	var collection = DATA.init({

		name: "orders",

		model: require("./ui.Orders.model").forContext(context),
		record: {
// TODO: Use record and get rid of model
		},

		collection: {			
// TODO: Clean collection


			// App
			getPending: function () {

				return this.store.getOrder(context.appContext.get('todayId'));
			}
		},

		// Low-level
		store: {
// Admin
			deleteOrder: function (id) {
				var self = this;

				return COMMON.API.Q.denodeify(function (callback) {

					var payload = {
						data: {
							type: "orders",
							id: id,
							attributes: {
								"deleted": true
							}
						}
					};

					return $.ajax({
						method: "PATCH",
						url: self.Source + "/" + id,
						contentType: "application/vnd.api+json",
						headers: {
							"Accept": "application/vnd.api+json"
						},
		    			dataType: "json",
						data: JSON.stringify(payload)
					})
					.done(function (response) {

						return callback(null);
					})
					.fail(function(err) {

		// TODO: Ask user to submit again.
		console.log("error!", err.stack);

						return callback(err);
					});
				})().then(function () {

					self.remove(id);
				});
			},
// App
			submitOrder: function (id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {

					var order = self.get(id);

					// @see http://jsonapi.org/format/#crud

					var data = order.toJSON();
					for (var name in data) {
						if (typeof data[name] === "object") {
							data[name] = JSON.stringify(data[name]);
						}
					}
					delete data.id;

		console.log("STORE DATA", data);

					var payload = {
						data: {
							type: "orders",
							attributes: data
						}
					};

					return $.ajax({
						method: "POST",
						url: self.Source + "/",
						contentType: "application/vnd.api+json",
						headers: {
							"Accept": "application/vnd.api+json"
						},
		    			dataType: "json",
						data: JSON.stringify(payload)
					})
					.done(function (response) {

						self.Model.getFields().forEach(function (name) {
							if (typeof response.data.attributes[name] !== "undefined") {
								order.set(name, response.data.attributes[name]);
							}
						});
						order.set("id", response.data.id);

						return callback(null, order);
					})
					.fail(function(err) {

		// TODO: Ask user to submit again.
		console.log("error!", err.stack);

						return callback(err);
					});
				})();
			},


			modelRecords: function (records) {
				var self = this;
				return records.map(function (record, i) {
					// Store model on backbone row so we can re-use it on subsequent calls.
					// NOTE: We purposfully store the model using `records[i]` instead of `record`
					//       as `record` 
					if (self._byId[records[i].get("id")].__model) {
						return self._byId[records[i].get("id")].__model;
					}
					var fields = {};
					self.Model.getFields().forEach(function (field) {
						if (!records[i].has(field)) return;
						fields[field] = records[i].get(field);
					});
					var model = self._byId[records[i].get("id")].__model = new self.Model(fields);
					record.on("change", function (record) {
						for (var name in record.changed) {
							model.set(name, record.changed[name]);
						}
					});
					return model;
				});
			},
// Admin
			loadAllOrdersForToday: function () {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            reset: true,
			            remove: true,
			            data: $.param({
			                "filter[day_id]": context.appContext.get('todayId')
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
			},
// Admin
			loadForVendorId: function (vendorId) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            reset: true,
			            remove: true,
			            data: $.param({
			                "filter[vendor_ids]": vendorId
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
		    },
// Admin
			loadForVendorIdAndDayId: function (vendorId, dayId) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            reset: true,
			            remove: true,
			            data: $.param({
			                "filter[vendor_ids]": vendorId,
			                "filter[day_id]": dayId
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
		    },

// App (receipt)
			loadOrderByHashId: function (orderHashId) {
				var self = this;
				return COMMON.API.Q.fcall(function () {
					var deferred = COMMON.API.Q.defer();
					// TODO: Ensure new entries are added to collection
					//       instead of removing all other entries.
					self.fetch({
						reset: false,
						remove: false,
						data: $.param({
							"filter[orderHashId]": orderHashId
						}),
						success: function () {
							var order = self.findWhere({
								orderHashId: orderHashId
							});
							if (!order) {
								return deferred.resolve(self);
							}
		//					return context.appContext.get('stores').events.loadForId(
		//						JSON.parse(order.get("event")).id
		//					).then(function () {
							return context.appContext.get('stores').cart.resetToSerializedModels(
								JSON.parse(order.get("items"))
							).then(function () {
								return deferred.resolve(order);
							}).fail(deferred.reject);
						}
					});
					return deferred.promise;
				});
			},
// App
			getActiveOrder: function () {
				var record = this.findWhere({
					orderHashId: context.appContext.get('context').id
				});
				return record;
			},
// App
			getOrder: function (todayId, verify) {
				var self = this;

				var orders = this.models.filter(function (model) {
					return (model.get('day_id') === todayId);
				});

				if (orders.length === 0) {

					self.add({
						id: COMMON.API.UUID.v4(),
						day_id: todayId
					});

					if (verify) {
						throw new Error("Verify loop!");
					}

			        var _notify_onChange = COMMON.API.UNDERSCORE.debounce(function () {

		// TODO: Save in local storage.
		//console.log("TODO: trigger save of order info in local storage so nothing is lost if order is not completed");
		// TODO: Leave out last four CC digits and security code.

			        }, 100);

					var order =  self.getOrder(todayId, true);
					order.on("change", _notify_onChange);

					order.submit = function (paymentToken) {

						return COMMON.API.Q.fcall(function () {

							// Serialize cart item models into order so we can display order later
							// without having original item data in DB. This makes the order timeless.

							return context.appContext.get('stores').cart.getSerializedModels().then(function (serializedItems) {

								var form = order.get("form");
								if (!form) {
									order.set("form", JSON.stringify({}));
								}

								order.set("items", serializedItems);
								order.set("summary", JSON.stringify(context.appContext.get('stores').cart.getSummary()));

								var orderFrom = {};
								var vendor_ids = {};
								serializedItems.forEach(function (item) {
									orderFrom[item["vendor.title"]] = true;
									vendor_ids[item.vendor_id] = true;
								});
								order.set("orderFrom", Object.keys(orderFrom).join("<br/>"));
								order.set("vendor_ids", Object.keys(vendor_ids).join(","));

								var today = context.appContext.get('stores').events.getToday();
								return context.appContext.get('stores').events.modelRecord(today).then(function (today) {

									order.set("deliveryStartTime", today.get("deliveryStartTime"));
									order.set("pickupEndTime", today.get("pickupEndTime"));
									order.set("event", today.getValues());
									order.set("event_id", today.get("id"));
									order.set("paymentToken", JSON.stringify(paymentToken));

		console.log("ORDER", order);
		console.log("paymentToken", paymentToken);

									// TODO: Send order to server and redirect to receipt using order ID hash.

									return self.submitOrder(order.get("id")).then(function () {

										return order;
									});
								});

							});

						}).fail(function (err) {
							// TODO: Error submitting order!
							console.error("submit error:", err.stack);
							throw err;
						});
					}

					return order;
				} else {
					return orders[0];
				}
			}


		}
	});

	return collection.store;
}


/*

	Model.latestStatusForRecords = function (records) {

		var status = {
			active: null,
			activeTime: null,
			history: []
		};
		records.forEach(function (record) {
			status.history.push([
				common.MOMENT().utc((record.get && record.get("time")) || record.time).unix(),
				record.get((record.get && record.get("status")) || record.status)
			]);
		});
		status.history.sort(function (a, b) {
			if (a[0] === b[0]) return 0;
			if (a[0] > b[0]) return -1;
			return 1;
		});
		if (status.history.length > 0) {
			status.activeTime = status.history[0][0];
			status.active = status.history[0][1];
		}

		return status;
	}

*/


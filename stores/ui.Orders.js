
var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {


	var collection = DATA.init({

		name: "orders",

		model: require("./ui.Orders.model").forContext(context),
		record: {
// TODO: Use record and get rid of model

			"@methods": {

				submit: function (paymentToken) {
					var self = this;

					return COMMON.API.Q.fcall(function () {

						if (!self.get("form")) self.set("form", JSON.stringify({}));
						self.set("items", DATA.get("cart/getSerializedForOrder()"));
						self.set("summary", JSON.stringify(DATA.get("cart/getSummary()")));
						self.set("paymentToken", JSON.stringify(paymentToken));

console.log("ORDER", self);

						return COMMON.API.Q.denodeify(function (callback) {

							var data = self.toJSON();
							for (var name in data) {
								if (typeof data[name] === "object") {
									data[name] = JSON.stringify(data[name]);
								}
							}
							delete data.id;

							var payload = {
								data: {
									type: "orders",
									attributes: data
								}
							};

console.log("Sending order payload:", payload);
							// @see http://jsonapi.org/format/#crud
							return $.ajax({
								method: "POST",
								url: self.collection.Collection.Source + "/",
								contentType: "application/vnd.api+json",
								headers: {
									"Accept": "application/vnd.api+json"
								},
				    			dataType: "json",
								data: JSON.stringify(payload),

								success: function (data, textStatus, jqXHR) {

console.log("SUCCESS data", data);									
console.log("SUCCESS textStatus", textStatus);									
console.log("SUCCESS jqXHR", jqXHR);									

									self.collection.Model.getFields().forEach(function (name) {
										if (typeof data.data.attributes[name] !== "undefined") {
											self.set(name, data.data.attributes[name]);
										}
									});
									self.set("id", data.data.id);

									return callback(null);
								},

								error: function (jqXHR, textStatus, errorThrown) {

console.error("Error submitting order");

console.error("jqXHR", jqXHR);
console.error("textStatus", textStatus);
console.error("errorThrown", errorThrown);

									return callback(new Error("Error submitting order. Please try again! (code: S05)"));

			/*
									if (err.status === 200) {
										// This happens on IE 8 & 9.
										// We had success after all.
										return;
									}
									for (var name in err) {
										console.error("ERR " + name + ": " + err[name]);
									}
									console.error("Error status code: " + err.statusCode);
									console.log("Error sending message to server!" + err.stack || err.message || err);
			// TODO: Display error.
			*/
								}
							});
						})();

					}).fail(function (err) {
						// TODO: Error submitting order!
						console.error("submit error:", err.stack);
						throw err;
					});
				}
			}
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

					var order = self.getOrder(todayId, true);
					order.on("change", _notify_onChange);

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


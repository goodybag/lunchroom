
const COMMON = require("./ui._common");


const ENDPOINT = COMMON.makeEndpointUrl("orders");



var Record = COMMON.API.BACKBONE.Model.extend({
	idAttribute: "id"
});

var Store = COMMON.API.BACKBONE.Collection.extend({
	model: Record,
	url: ENDPOINT,
	parse: function(data) {
		return data.data.map(function (record) {
			return COMMON.API.UNDERSCORE.extend(record.attributes, {
				id: record.id
			});
		});
	},

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

			var payload = {
				data: {
					type: "orders",
					attributes: data
				}
			};

			return $.ajax({
				method: "POST",
				url: ENDPOINT + "/",
				contentType: "application/vnd.api+json",
				headers: {
					"Accept": "application/vnd.api+json"
				},
    			dataType: "json",
				data: JSON.stringify(payload)
			})
			.done(function (response) {

				for (var name in self.Model.prototype._definition) {
					if (typeof response.data.attributes[name] !== "undefined") {
						order.set(name, response.data.attributes[name]);
					}
				}
				order.set("id", response.data.id);

				return callback(null, order.get("orderHashId"));
			})
			.fail(function(err) {

// TODO: Ask user to submit again.
console.log("error!", err.stack);

				return callback(err);
			});
		})();
	}
});


var store = new Store();


var orderIndex = 0;

exports.for = function (context) {


	function loadStatusInfoForOrder (orderHashId) {
		return context.appContext.stores.orderStatus.fetchStatusInfoForOrderHashId(orderHashId);
	}


	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = store.Model = COMMON.API.AMPERSAND_STATE.extend({
		props: {
			id: "string",
			orderHashId: "string",
			day_id: "string",
	        form: "object",
	        items: "object",
	        event: "object",
	        "deliveryStartTime": "string",
	        "pickupEndTime": "string",
	        "orderFrom": "string",
	        "vendor_ids": "string",
	        "statusInfo": "object"
	    },
	    derived: {
	    	"format.deliveryTime": COMMON.makeFormatter("deliveryTime"),
	    	"format.deliveryDate": COMMON.makeFormatter("deliveryDate"),
	    	"event.consumerGroup.contact": {
	    		deps: [
					"event"
				],
	            fn: function () {
	            	if (!this.event) return "";
	            	return this.event["consumerGroup.contact"];
	            }
	    	},
	    	"event.consumerGroup.pickupLocation": {
	    		deps: [
					"event"
				],
	            fn: function () {
	            	if (!this.event) return "";
	            	return this.event["consumerGroup.pickupLocation"];
	            }
	    	},
	    	"number": {
	    		deps: [
					"id"
				],
	            fn: function () {
	            	return ""+this.id;
	            }
	    	},
	    	"status.id": {
	    		deps: [
		    		"id",
		    		"orderHashId",
					"statusInfo"
				],
	            fn: function () {
	            	if (
	            		!this.statusInfo &&
	            		this.orderHashId
	            	) {
	            		loadStatusInfoForOrder(this.orderHashId)
	            	}
	            	return (this.statusInfo && this.statusInfo.active) || "new";
	            }
	    	},
	    	"status.format": {
	    		deps: [
					"statusInfo"
				],
	            fn: function () {
	            	if (
	            		!this.statusInfo ||
	            		!this.statusInfo.active
	            	) return "New";
	            	return this.statusInfo.active.substring(0, 1).toUpperCase() + this.statusInfo.active.substring(1);
	            }
	    	}
	    }
	});

	store.modelRecords = function (records) {
		return records.map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			// NOTE: We purposfully store the model using `records[i]` instead of `record`
			//       as `record` 
			if (store._byId[records[i].get("id")].__model) {
				return store._byId[records[i].get("id")].__model;
			}
			var fields = {};
			Object.keys(Model.prototype._definition).forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			var model = store._byId[records[i].get("id")].__model = new Model(fields);
			record.on("change", function (record) {
				for (var name in record.changed) {
					model.set(name, record.changed[name]);
				}
			});
			return model;
		});
	}

	store.loadForVendorId = function (vendorId) {
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
    }

	store.loadOrderByHashId = function (orderHashId) {
		return COMMON.API.Q.fcall(function () {
			var deferred = COMMON.API.Q.defer();
			// TODO: Ensure new entries are added to collection
			//       instead of removing all other entries.
			store.fetch({
				reset: false,
				remove: false,
				data: $.param({
					"filter[orderHashId]": orderHashId
				}),
				success: function () {
					var order = store.findWhere({
						orderHashId: orderHashId
					});
					if (!order) {
						return deferred.resolve(store);
					}
					return context.appContext.stores.cart.resetToSerializedModels(order.get("items")).then(function () {
						return deferred.resolve(store);
					}).fail(deferred.reject);
				}
			});
			return deferred.promise;
		});
	}

	store.getActiveOrder = function () {
		if (!context.appContext.context) {
			throw new Error("No active order because there is no active context!");
		}
		var record = store.findWhere({
			orderHashId: context.appContext.context.id
		});
		return record;
	}

	store.getOrder = function (todayId, verify) {

		var orders = this.models.filter(function (model) {
			return (model.get('day_id') === todayId);
		});

		if (orders.length === 0) {

			this.add({
				id: COMMON.API.UUID.v4(),
				day_id: todayId
			});

			if (verify) {
				throw new Error("Verify loop!");
			}

	        var _notify_onChange = COMMON.API.UNDERSCORE.debounce(function () {

// TODO: Save in local storage.
console.log("TODO: trigger save of order info in local storage so nothing is lost if order is not completed");
// TODO: Leave out last four CC digits and security code.

	        }, 100);

			var order =  store.getOrder(todayId, true);
			order.on("change", _notify_onChange);

			order.submit = function () {

				return COMMON.API.Q.fcall(function () {

					// Serialize cart item models into order so we can display order later
					// without having original item data in DB. This makes the order timeless.

					return context.appContext.stores.cart.getSerializedModels().then(function (serializedItems) {

						order.set("items", serializedItems);
						var orderFrom = {};
						var vendor_ids = {};
						serializedItems.forEach(function (item) {
							orderFrom[item["vendor.title"]] = true;
							vendor_ids[item.vendor_id] = true;
						});
						order.set("orderFrom", Object.keys(orderFrom).join("<br/>"));
						order.set("vendor_ids", Object.keys(vendor_ids).join(","));

						var today = context.appContext.stores.events.getToday();
						return context.appContext.stores.events.modelRecord(today).then(function (today) {

							order.set("deliveryStartTime", today.get("deliveryStartTime"));
							order.set("pickupEndTime", today.get("pickupEndTime"));
							order.set("event", today.getAttributes({
								props: true,
								session: true,
								derived: true
							}));

							// TODO: Send order to server and redirect to receipt using order ID hash.

							return store.submitOrder(order.get("id")).then(function (orderHashId) {

								return context.appContext.redirectTo(
									"order-" + orderHashId,
									"Order_Placed"
								);
							});
						});

					});

				}).fail(function (err) {
					// TODO: Error submitting order!
					console.error(err.stack);
					throw err;
				});
			}

			return order;
		} else {
			return orders[0];
		}
	}

	return store;
}


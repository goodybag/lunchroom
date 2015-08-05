
const COMMON = require("./ui._common");


const ENDPOINT = COMMON.makeEndpointUrl("events");


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

	setReadyForEventId: function (event_id) {
		var self = this;

		return COMMON.API.Q.denodeify(function (callback) {

			var payload = {
				data: {
					type: "events",
					id: event_id,
					attributes: {
						"menuReady": true
					}
				}
			};

			return $.ajax({
				method: "PATCH",
				url: ENDPOINT + "/" + event_id,
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

			return self.loadForId(event_id);
		});
	},

	createEvent: function (fields) {
		var self = this;

		return COMMON.API.Q.denodeify(function (callback) {

			function getDataForFields (fields) {
				var data = {};
				for (var name in self.Model.prototype._definition) {
					if (typeof fields[name] !== "undefined") {
						data[name] = "" + fields[name];
					}
				}
				data["goodybagFee"] = data["goodybagFee"] * 100;

				data["orderByTime"] = COMMON.API.MOMENT(
					data["day_id"] + ":" + data["orderByTime"], "YYYY-MM-DD:H:mm"
				).format();
				data["deliveryStartTime"] = COMMON.API.MOMENT(
					data["day_id"] + ":" + data["deliveryStartTime"], "YYYY-MM-DD:H:mm"
				).format();
				data["pickupEndTime"] = COMMON.API.MOMENT(
					data["day_id"] + ":" + data["pickupEndTime"], "YYYY-MM-DD:H:mm"
				).format();

				return data;
			}

			var payload = {
				data: {
					type: "events",
					attributes: getDataForFields(fields)
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

		        self.reset();
		        self.fetch();

				return callback(null, response.data);
			})
			.fail(function(err) {

// TODO: Ask user to submit again.
console.log("error!", err.stack);

				return callback(err);
			});
		})();
	}
});


exports.for = function (context) {

	var store = new Store();


//	store.fetch();


	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = store.Model = COMMON.API.AMPERSAND_STATE.extend({
		props: {
			id: "string",
	        day_id: "string",
	        "orderByTime": "string",
	        "deliveryStartTime": "string",
	        "pickupEndTime": "string",
	        "consumer_group_id": "string",
	        "goodybagFee": "string",
	        "tip": "string",
	        "token": "string",
	        "menuReady": "boolean",
	        "notificationsSent": "boolean",

	        // TODO: Add these dynamically using foreign model.
	        "consumerGroup.title": "string",
	        "consumerGroup.contact": "string",
	        "consumerGroup.address": "string",
	        "consumerGroup.pickupLocation": "string",
	        "consumerGroup.orderTax": "string"
	    },
	    derived: {
		    "day.format.ddd": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("ddd");
	            }
		    },
		    "day.format.MMM": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("MMM");
	            }
		    },
		    "day.format.D": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("D");
	            }
		    },
		    "day.format.dddd-type": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	var str = COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("dd");
	            	if (str === "Sa" || str === "Su") {
	            		return "Weekend"
	            	} else {
	            		return "Weekday"
	            	}
	            }
		    },
		    "ordersLocked": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	return COMMON.API.MOMENT().isAfter(this.orderByTime);
	            }
		    },
		    "canOrder": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = COMMON.API.MOMENT(this.orderByTime);
	            	if (!orderByTime.isSame(COMMON.API.MOMENT(), 'day')) {
	            		// Not today
	            		return false;
	            	}
	            	if (orderByTime.isBefore(COMMON.API.MOMENT())) {
	            		// After deadline
	            		return false;
	            	}
	            	// TODO: Monitor quantities.
	            	return true;
	            }
		    },
		    "format.deliveryDate": COMMON.makeFormatter("deliveryDate"),
		    "format.deliveryTime": COMMON.makeFormatter("deliveryTime"),
		    "format.orderTimer": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = COMMON.API.MOMENT(this.orderByTime);
	            	if (orderByTime.isBefore(COMMON.API.MOMENT())) {
	            		// After deadline
	            		return false;
	            	}
	            	return COMMON.API.MOMENT().to(orderByTime, true)
	            		.replace(/minutes/, "min");
	            }
		    },
		    "format.goodybagFee": {
		    	deps: [
					"goodybagFee"
				],
	            fn: function () {
	            	return COMMON.API.NUMERAL(this.goodybagFee/100).format('0.00');
	            }
		    },
		    "format.menuReady": {
		    	deps: [
					"menuReady"
				],
				cache: false,
	            fn: function () {
	            	return (this.menuReady ? "Yes" : "No");
	            }
		    },
		    "format.notificationsSent": {
		    	deps: [
					"notificationsSent"
				],
				cache: false,
	            fn: function () {
	            	return (this.notificationsSent ? "Yes" : "No");
	            }
		    }
	    }
	});

	store.getToday = function () {
		var today = store.get(context.appContext.context.dbfilter.event_id);
		if (!today) return [];
		return [
			today
		];
	}

	store.loadForDay = function (day_id) {
		var self = this;
		return COMMON.API.Q.denodeify(function (callback) {
	        self.fetch({
	            data: $.param({
	                "filter[day_id]": day_id
	            }),
	            success: function () {
	            	return callback(null);
	            }
	        });
		})();
	}

	store.loadForId = function (id) {
		var self = this;
		return COMMON.API.Q.denodeify(function (callback) {
	        self.fetch({
	            data: $.param({
	                "filter[id]": id
	            }),
	            success: function () {
	            	return callback(null);
	            }
	        });
		})();
	}

	store.modelRecords = function (records) {
		return COMMON.resolveForeignKeys(store, records, {
			"consumer_group_id": {
				store: require("./ui.ConsumerGroups"),
				model: context.appContext.stores.consumerGroups.Model,
				localFieldPrefix: "consumerGroup"
			}
		}).map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			if (store._byId[records[i].get("id")].__model) {
				var model = store._byId[records[i].get("id")].__model;
				Object.keys(Model.prototype._definition).forEach(function (field) {
					if (record.has(field) && model.get(field) !== record.get(field)) {
						model.set(field, record.get(field));
					}
				});
				return model;
			}
			var fields = {};
			Object.keys(Model.prototype._definition).forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			return store._byId[records[i].get("id")].__model = new Model(fields);
		});
	}

	store.modelRecord = function (record) {
		if (!Array.isArray(record)) {
			record = [
				record
			];
		}
		return COMMON.resolveForeignKeys(store, record, {
			"consumer_group_id": {
				store: require("./ui.ConsumerGroups"),
				model: context.appContext.stores.consumerGroups.Model,
				localFieldPrefix: "consumerGroup"
			}
		}, true).then(function (records) {
			return records.map(function (record, i) {
				// Store model on backbone row so we can re-use it on subsequent calls.
				if (store._byId[records[i].get("id")].__model) {
					var model = store._byId[records[i].get("id")].__model;
					Object.keys(Model.prototype._definition).forEach(function (field) {
						if (record.has(field) && model.get(field) !== record.get(field)) {
							model.set(field, record.get(field));
						}
					});
					return model;
				}
				var fields = {};
				Object.keys(Model.prototype._definition).forEach(function (field) {
					if (!records[i].has(field)) return;
					fields[field] = records[i].get(field);
				});
				return store._byId[records[i].get("id")].__model = new Model(fields);
			})[0];
		});
	}
	return store;
}


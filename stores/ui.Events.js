
var COMMON = require("./ui._common");


var ENDPOINT = COMMON.makeEndpointUrl("events");


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

	setDeliveredForEventId: function (event_id) {
		var self = this;

		return COMMON.API.Q.denodeify(function (callback) {

			var payload = {
				data: {
					type: "events",
					id: event_id,
					attributes: {
						"delivered": true
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

	deleteForEventId: function (event_id) {
		var self = this;
		return COMMON.API.Q.denodeify(function (callback) {

			return $.ajax({
				method: "DELETE",
				url: ENDPOINT + "/" + event_id
			})
			.done(function (response) {

				self.remove(event_id);

				return callback(null);
			})
			.fail(function(err) {

// TODO: Ask user to submit again.
console.log("error!", err.stack);

				return callback(err);
			});
		})();
	},

	createEvent: function (fields) {
		var self = this;

		return COMMON.API.Q.denodeify(function (callback) {

			function getDataForFields (fields) {
				var data = {};
				self.Model.getFields().forEach(function (name) {
					if (typeof fields[name] !== "undefined") {
						data[name] = "" + fields[name];
					}
				});
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


exports['for'] = function (context) {

	var store = new Store();


	store.Model = require("./ui.Events.model").forContext(context);


	store.getToday = function () {
		var today = store.get(context.appContext.get('context').dbfilter.event_id);
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
	            	return callback(null, store.get(id));
	            }
	        });
		})();
	}

	store.loadForConsumerGroupId = function (id) {
		var self = this;

		var dayIds = context.appContext.get('stores').days.getDayIds();

		return COMMON.API.Q.denodeify(function (callback) {
	        self.fetch({
	            data: $.param({
	                "filter[consumer_group_id]": id,
	                "filter[day_id]": dayIds
	            }),
	            success: function () {
	            	return callback(null, store.where({
	            		"consumer_group_id": id
	            	}));
	            }
	        });
		})();
	}

	store.modelRecords = function (records) {
		return COMMON.resolveForeignKeys(store, records, {
			"consumer_group_id": {
				store: require("./ui.ConsumerGroups"),
				model: context.appContext.get('stores').consumerGroups.Model,
				localFieldPrefix: "consumerGroup"
			}
		}).map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			if (store._byId[records[i].get("id")].__model) {
				var model = store._byId[records[i].get("id")].__model;
				store.Model.getFields().forEach(function (field) {
					if (record.has(field) && model.get(field) !== record.get(field)) {
						model.set(field, record.get(field));
					}
				});
				return model;
			}
			var fields = {};
			store.Model.getFields().forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			return store._byId[records[i].get("id")].__model = new store.Model(fields);
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
				model: context.appContext.get('stores').consumerGroups.Model,
				localFieldPrefix: "consumerGroup"
			}
		}, true).then(function (records) {
			return records.map(function (record, i) {
				// Store model on backbone row so we can re-use it on subsequent calls.
				if (store._byId[records[i].get("id")].__model) {
					var model = store._byId[records[i].get("id")].__model;
					store.Model.getFields().forEach(function (field) {
						if (record.has(field) && model.get(field) !== record.get(field)) {
							model.set(field, record.get(field));
						}
					});
					return model;
				}
				var fields = {};
				store.Model.getFields().forEach(function (field) {
					if (!records[i].has(field)) return;
					fields[field] = records[i].get(field);
				});
				return store._byId[records[i].get("id")].__model = new store.Model(fields);
			})[0];
		});
	}
	return store;
}


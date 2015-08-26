var console = require("../app/lib/console");

var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	function makeBaseTime () {
	  return COMMON.API.MOMENT().seconds(0).minutes(0);
	}

	var collection = DATA.init({

		name: "events",

		model: require("./ui.Events.model").forContext(context),
		record: {
// TODO: Use record and get rid of model

			"consumer_group_id": {
				"linksTo": "consumer-groups"
			},


		    "vendor": {
		    	"derived": function () {
	            	// We use the vendor of the first item in this event.
					var records = DATA.get('menus/*[event_id="' + this.id + '"]');
					if (records.length === 0) {
						return (undefined);
					}
					return DATA.get('vendors/' + records[0].get("vendor_id"));
	            }
		    }

		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {
// Admin
			setPresets: function (presets) {
				try {
					presets = JSON.parse(JSON.stringify(presets));
					delete presets.day_id;
					COMMON.storeLocalValueFor("admin.events", "presets", JSON.stringify(presets));
				} catch (err) {
					console.error("Error setting presets");
				}
			},

// Admin
			getPresets: function () {
		        var presets = COMMON.getLocalValueFor("admin.events", "presets");
		        if (presets) {
					try {
						presets = JSON.parse(presets);
					} catch (err) {
						console.error("Error recovering presets from local storage");
					}
		        } else {
					presets = {
						menuEmailTime: makeBaseTime().hours(10).format("H:mm"),
						menuSmsTime: makeBaseTime().hours(10).format("H:mm"),
						orderByTime: makeBaseTime().hours(11).format("H:mm"),
						deliveryStartTime: makeBaseTime().hours(12).format("H:mm"),
						pickupEndTime: makeBaseTime().hours(12).minutes(30).format("H:mm"),
						goodybagFee: "2.99"
					};
		        }
		        return presets;
		    },

// Admin
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
						url: self.Source + "/" + event_id,
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

// Admin
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
						url: self.Source + "/" + event_id,
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

// Admin
			deleteForEventId: function (event_id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {

					return $.ajax({
						method: "DELETE",
						url: self.Source + "/" + event_id
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

// Admin
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
						data["menuEmailTime"] = COMMON.API.MOMENT(
							data["day_id"] + ":" + data["menuEmailTime"], "YYYY-MM-DD:H:mm"
						).format();
						data["menuSmsTime"] = COMMON.API.MOMENT(
							data["day_id"] + ":" + data["menuSmsTime"], "YYYY-MM-DD:H:mm"
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
						url: self.Source + "/",
						contentType: "application/vnd.api+json",
						headers: {
							"Accept": "application/vnd.api+json"
						},
		    			dataType: "json",
						data: JSON.stringify(payload)
					})
					.done(function (response) {

						return callback(null, response.data);
					})
					.fail(function(err) {

		// TODO: Ask user to submit again.
		console.log("error!", err.stack);

						return callback(err);
					});
				})();
			},


// App
			getToday: function () {
				var today = this.get(context.appContext.get('context').dbfilter.event_id);
				if (!today) return [];
				return [
					today
				];
			},

// App
			getModeledForDay: function (day_id) {
				return this.modelRecords(this.where({
					"day_id": day_id
				}));
			},
// Admin
			loadForDay: function (day_id) {
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
			},
// App
			loadForId: function (id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            data: $.param({
			                "filter[id]": id
			            }),
			            success: function () {
			            	return callback(null, self.get(id));
			            }
			        });
				})();
			},
// Admin
			loadForConsumerGroupId: function (id) {
				var self = this;

				var dayIds = context.appContext.get('stores').days.getDayIds();

				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            data: $.param({
			                "filter[consumer_group_id]": id,
			                "filter[day_id]": dayIds.join(",")
			            }),
			            success: function () {
			            	return callback(null, self.where({
			            		"consumer_group_id": id
			            	}));
			            }
			        });
				})();
			},

			modelRecords: function (records) {
				var self = this;
				return COMMON.resolveForeignKeys(self, records, {
					"consumer_group_id": {
						store: require("./ui.ConsumerGroups"),
						model: context.appContext.get('stores').consumerGroups.Model,
						localFieldPrefix: "consumerGroup"
					}
				}).map(function (record, i) {
					// Store model on backbone row so we can re-use it on subsequent calls.
					if (self._byId[records[i].get("id")].__model) {
						var model = self._byId[records[i].get("id")].__model;
						self.Model.getFields().forEach(function (field) {
							if (record.has(field) && model.get(field) !== record.get(field)) {
								model.set(field, record.get(field));
							}
						});
						return model;
					}
					var fields = {};
					self.Model.getFields().forEach(function (field) {
						if (!records[i].has(field)) return;
						fields[field] = records[i].get(field);
					});
					return self._byId[records[i].get("id")].__model = new self.Model(fields);
				});
			},

			modelRecord: function (record) {
				var self = this;
				if (!Array.isArray(record)) {
					record = [
						record
					];
				}
				return COMMON.resolveForeignKeys(self, record, {
					"consumer_group_id": {
						store: require("./ui.ConsumerGroups"),
						model: context.appContext.get('stores').consumerGroups.Model,
						localFieldPrefix: "consumerGroup"
					}
				}, true).then(function (records) {
					return records.map(function (record, i) {
						// Store model on backbone row so we can re-use it on subsequent calls.
						if (self._byId[records[i].get("id")].__model) {
							var model = self._byId[records[i].get("id")].__model;
							self.Model.getFields().forEach(function (field) {
								if (record.has(field) && model.get(field) !== record.get(field)) {
									model.set(field, record.get(field));
								}
							});
							return model;
						}
						var fields = {};
						self.Model.getFields().forEach(function (field) {
							if (!records[i].has(field)) return;
							fields[field] = records[i].get(field);
						});
						return self._byId[records[i].get("id")].__model = new self.Model(fields);
					})[0];
				});
			}

		}
	});

	return collection.store;
}



var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	var collection = DATA.init({

		name: "menus",

		model: require("./ui.Menus.model").forContext(context),
		record: {
// TODO: Use record and get rid of model

			"item_id": {
				"linksTo": "items"
			},
			"vendor_id": {
				"linksTo": "vendors"
			},
			"cartQuantity": {
				"derived": function () {

					// TODO: Use data connect string with summary function.

					return context.appContext.get('stores').cart.getQuantityForItemId(this.item_id);
				}
			}

		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {

// App
			getForEventIds: function (ids) {
				this.where();
				return this.models.filter(function (model) {
					return (typeof ids[model.get('event_id')] !== "undefined");
				});
			},
// App
			loadForEvent: function (event_id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            data: $.param({
			                "filter[event_id]": ""+event_id
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
			},
// App
			loadForEvents: function (event_ids) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            data: $.param({
			                "filter[event_id]": event_ids.join(",")
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
			},
// Admin
			addItem: function (event_id, vendor_id, item_id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {

					var payload = {
						data: {
							type: "menus",
							attributes: {
								event_id: event_id,
								vendor_id: vendor_id,
								item_id: item_id
							}
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
						return callback(null, response.data.id);
					})
					.fail(function(err) {

		// TODO: Ask user to submit again.
		console.log("error!", err.stack);

						return callback(err);
					});
				})();
			},
// Admin
			removeAtId: function (id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {

					return $.ajax({
						method: "DELETE",
						url: self.Source + "/" + id
					})
					.done(function (response) {
						return callback(null);
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
				return COMMON.resolveForeignKeys(self, records, {
					"vendor_id": {
						store: require("./ui.Vendors"),
						model: context.appContext.get('stores').vendors.Model,
						localFieldPrefix: "vendor"
					},
					"item_id": {
						store: require("./ui.Items"),
						model: context.appContext.get('stores').items.Model,
						localFieldPrefix: "item"
					}
				}).map(function (record, i) {
					// Store model on backbone row so we can re-use it on subsequent calls.
					if (self._byId[records[i].get("id")].__model) {
						return self._byId[records[i].get("id")].__model;
					}
					var fields = {};
					self.Model.getFields().forEach(function (field) {

		//console.log("COPY FIELD", records[i]);

						if (!records[i].has(field)) return;

						fields[field] = records[i].get(field);
					});
					return self._byId[records[i].get("id")].__model = new self.Model(fields);
				});
			}


		}
	});

	return collection.store;
}

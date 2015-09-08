var console = require("../app/lib/console");

var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	var collection = DATA.init({

		name: "consumer-groups",

		model: require("./ui.ConsumerGroups.model").forContext(context),
		record: {
// TODO: Use record and get rid of model
		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {

// Admin
			setLunchroomOpenForId: function (id) {
				var self = this;

				return COMMON.API.Q.denodeify(function (callback) {

					self.get(id).set("lunchroomLive", true);

					var payload = {
						data: {
							type: "consumer-groups",
							id: id,
							attributes: {
								"lunchroomLive": true
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
				})();
			},

// Admin
			setLunchroomClosedForId: function (id) {
				var self = this;

				return COMMON.API.Q.denodeify(function (callback) {

					self.get(id).set("lunchroomLive", false);

					var payload = {
						data: {
							type: "consumer-groups",
							id: id,
							attributes: {
								"lunchroomLive": false
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
				})();
			},

// App
			getLunchroom: function () {
				var today = context.appContext.get("stores").events.getToday()[0];
				if (!today) return [];
				return [
					this.get(today.get("consumer_group_id"))
				];
			},
// App
			loadForId: function (consumer_group_id) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            reset: true,
			            remove: true,
			            data: $.param({
			                "filter[id]": consumer_group_id
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
			},

			modelRecords: function (records) {
				var self = this;
				return records.map(function (record, i) {

//console.log("record", record);

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
					return self._byId[records[i].get("id")].__model = new self.Model(fields);
				});
			}

		}
	});



	if (context.ids) {
		var deferred = COMMON.API.Q.defer();
		context.ids = context.ids.filter(function (id) {
			return !collection.store._byId[id];
		});
		if (context.ids.length > 0) {
			collection.store.once("sync", function () {
				deferred.resolve(collection.store);
			});
			// TODO: Ensure new entries are added to collection
			//       instead of removing all other entries.
			collection.store.fetch({
				reset: false,
				remove: false,
				data: $.param({
					"filter[id]": context.ids.join(",")
				})
			});
		} else {
			deferred.resolve(collection.store);
		}
		return deferred.promise;
	}


	return collection.store;
}

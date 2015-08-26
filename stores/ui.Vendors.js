var console = require("../app/lib/console");


var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {


	var collection = DATA.init({

		name: "vendors",

		model: require("./ui.Vendors.model").forContext(context),
		record: {
// TODO: Use record and get rid of model
		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {

			// Admin OK
			loadAll: function () {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
					self.fetch({
						reset: false,
						remove: false,
						success: function () {
							return callback(null);
						}
					});
				})();
			},


// Admin
			idForAdminAccessToken: function (adminAccessToken) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
					self.fetch({
						reset: false,
						remove: false,
						data: $.param({
							"filter[adminAccessToken]": adminAccessToken
						}),
						success: function () {
							var vendor = self.findWhere({
								adminAccessToken: adminAccessToken
							});
							if (!vendor) {
								return callback(null);
							}
							return callback(null, vendor.get("id"));
						}
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

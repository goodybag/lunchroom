
var COMMON = require("./ui._common");
var NUMERAL = require("numeral");

var ENDPOINT = COMMON.makeEndpointUrl("vendors");



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
	}
});


var store = new Store();

exports['for'] = function (context) {

	if (context.ids) {
		var deferred = COMMON.API.Q.defer();
		context.ids = context.ids.filter(function (id) {
			return !store._byId[id];
		});
		if (context.ids.length > 0) {
			store.once("sync", function () {
				deferred.resolve(store);
			});
			// TODO: Ensure new entries are added to collection
			//       instead of removing all other entries.
			store.fetch({
				reset: false,
				remove: false,
				data: $.param({
					"filter[id]": context.ids.join(",")
				})
			});
		} else {
			deferred.resolve(store);
		}
		return deferred.promise;
	}


	store.Model = require("./ui.Vendors.model").forContext(context);


	store.idForAdminAccessToken = function (adminAccessToken) {
		return COMMON.API.Q.denodeify(function (callback) {
			store.fetch({
				reset: false,
				remove: false,
				data: $.param({
					"filter[adminAccessToken]": adminAccessToken
				}),
				success: function () {
					var vendor = store.findWhere({
						adminAccessToken: adminAccessToken
					});
					if (!vendor) {
						return callback(null);
					}
					return callback(null, vendor.get("id"));
				}
			});
		})();
	}

	store.modelRecords = function (records) {
		return records.map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			// NOTE: We purposfully store the model using `records[i]` instead of `record`
			//       as `record` 
			if (store._byId[records[i].get("id")].__model) {
				return store._byId[records[i].get("id")].__model;
			}
			var fields = {};
			store.Model.getFields().forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			return store._byId[records[i].get("id")].__model = new store.Model(fields);
		});
	}

	return store;
}

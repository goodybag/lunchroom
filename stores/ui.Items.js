
var COMMON = require("./ui._common");

var ENDPOINT = COMMON.makeEndpointUrl("items");



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


	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = store.Model = COMMON.API.AMPERSAND_STATE.extend({
		props: {
			id: "string",
			item_id: "string",
	        vendor_id: "string",
	        title: "string",
	        description: "string",
	        photo_url: "string",
	        properties: "string",
	        options: "string",
	        price: "integer",
	        quantity: "integer",
			// TODO: Add these dynamically using foreign model.
	        "vendor.title": "string"
	    },
	    derived: {
		    "format.price": {
				deps: [
					"price"
				],
	            fn: function () {
	            	var number = 0;
	            	if (this.price) {
	            		number = this.price / 100;
	            	}
	            	return COMMON.API.NUMERAL(number).format('0.00');
	            }
		    },
		    "format.amount": {
				deps: [
					"price",
					"quantity"
				],
	            fn: function () {
	            	var number = 0;
	            	if (this.price && this.quantity) {
	            		number = (this.price * this.quantity / 100);
	            	}
	            	return COMMON.API.NUMERAL(number).format('0.00');
	            }
		    }
		}
	});

	store.modelRecords = function (records) {
		return COMMON.resolveForeignKeys(store, records, {
			"vendor_id": {
				store: require("./ui.Vendors"),
				model: context.appContext.get('stores').vendors.Model,
				localFieldPrefix: "vendor"
			}
		}).map(function (record, i) {
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
			return store._byId[records[i].get("id")].__model = new Model(fields);
		});
	}

	store.loadForVendor = function (vendor_id) {
		var self = this;
		return COMMON.API.Q.denodeify(function (callback) {
	        self.fetch({
	            data: $.param({
	                "filter[vendor_id]": ""+vendor_id
	            }),
	            success: function () {
	            	return callback(null);
	            }
	        });
		})();
	}

	store.resolveRecordsAndWait = function (records, options) {

		return COMMON.resolveForeignKeys(store, records, {
			"vendor_id": {
				store: require("./ui.Vendors"),
				model: context.appContext.get('stores').vendors.Model,
				localFieldPrefix: "vendor"
			}
		}, true, options).then(function (records) {

			var idFieldName = (options && options.useIdField) || "id";

			return records.map(function (record, i) {
				// Store model on backbone row so we can re-use it on subsequent calls.
				// NOTE: We purposfully store the model using `records[i]` instead of `record`
				//       as `record`
				if (records[i].__model) {
					return records[i].__model;
				}
				var fields = {};
				store.Model.getFields().forEach(function (field) {
					if (!records[i].has(field)) return;
					fields[field] = records[i].get(field);
				});
				return records[i].__model = new Model(fields);
			});
		});
	}

	return store;
}


var COMMON = require("./ui._common");


var ENDPOINT = COMMON.makeEndpointUrl("menus");


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


exports['for'] = function (context) {

	var store = new Store();


//	store.fetch();


	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		props: {
			id: "string",
			event_id: "string",
	        item_id: "string",
	        vendor_id: "string",
	        // TODO: Add these dynamically using foreign model.
	        "item.title": "string",
	        "item.photo_url": "string",
	        "item.price": "string"
	    }
	});

	store.getForEventIds = function (ids) {
		this.where();
		return this.models.filter(function (model) {
			return (typeof ids[model.get('event_id')] !== "undefined");
		});
	}

	store.loadForEvent = function (event_id) {
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
	}

	store.addItem = function (event_id, vendor_id, item_id) {
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
				url: ENDPOINT + "/",
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
	}

	store.removeAtId = function (id) {
		var self = this;
		return COMMON.API.Q.denodeify(function (callback) {

			var payload = {
				data: {
					type: "menus",
					attributes: {
						id: id
					}
				}
			};

			return $.ajax({
				method: "DELETE",
				url: ENDPOINT + "/" + id
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
	}

	store.modelRecords = function (records) {
		return COMMON.resolveForeignKeys(store, records, {
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
			if (store._byId[records[i].get("id")].__model) {
				return store._byId[records[i].get("id")].__model;
			}
			var fields = {};
			Model.getFields().forEach(function (field) {

//console.log("COPY FIELD", records[i]);

				if (!records[i].has(field)) return;

				fields[field] = records[i].get(field);
			});
			return store._byId[records[i].get("id")].__model = new Model(fields);
		});
	}

	return store;
}


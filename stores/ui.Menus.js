
const COMMON = require("./ui._common");


const ENDPOINT = COMMON.makeEndpointUrl("menus");


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


exports.for = function (context) {

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
	        "item.title": "string"
	    }
	});

	store.getForEventIds = function (ids) {
		this.where();
		return this.models.filter(function (model) {
			return (typeof ids[model.get('event_id')] !== "undefined");
		});
	}

	store.modelRecords = function (records) {
		return COMMON.resolveForeignKeys(store, records, {
			"vendor_id": {
				store: require("./ui.Vendors"),
				model: context.appContext.stores.vendors.Model,
				localFieldPrefix: "vendor"
			},
			"item_id": {
				store: require("./ui.Items"),
				model: context.appContext.stores.items.Model,
				localFieldPrefix: "item"
			}
		}).map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			if (store._byId[records[i].get("id")].__model) {
				return store._byId[records[i].get("id")].__model;
			}
			var fields = {};
			Object.keys(Model.prototype._definition).forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			return store._byId[records[i].get("id")].__model = new Model(fields);
		});
	}

	return store;
}


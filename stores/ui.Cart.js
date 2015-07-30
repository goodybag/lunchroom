
const COMMON = require("./ui._common");


//const ENDPOINT = COMMON.makeEndpointUrl("items");



var Record = COMMON.API.BACKBONE.Model.extend({
	idAttribute: "id"
});

var Store = COMMON.API.BACKBONE.Collection.extend({
	model: Record,
//	url: ENDPOINT,
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

	store.modelRecords = function (records) {

		var Model = context.appContext.stores.items.Model;

		return records.map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			// NOTE: We purposfully store the model using `records[i]` instead of `record`
			//       as `record` 
			if (store._byId[records[i].get("id")].__model) {
				return store._byId[records[i].get("id")].__model;
			}
			var fields = {};
			Object.keys(Model.prototype._definition).forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			var model = store._byId[records[i].get("id")].__model = new Model(fields);
			record.on("change", function (record) {
				for (var name in record.changed) {
					model.set(name, record.changed[name]);
				}
			});
			return model;
		});
	}

	store.addItem = function (itemId, options) {
		var self = this;

		var options = COMMON.API.CJSON(options || {});

		function ensureItem () {

			var optionsHash = new COMMON.API.JSSHA("SHA-1", "TEXT");
			optionsHash.update(options);
			var cartItemId = itemId + "-" + optionsHash.getHash("HEX");

			if (self.get(cartItemId)) {
				return COMMON.API.Q.resolve(self.get(cartItemId));
			}
			return require("./ui.Items").for({
				appContext: context.appContext,
				ids: [
					itemId
				]
			}).then(function (items) {				
				var item = items.get(itemId).toJSON();

				item.item_id = item.id;
				item.id = cartItemId;

				item.quantity = 0;
				item.options = options;
				self.add(item);
				return self.get(cartItemId);
			});
		}

		return ensureItem().then(function (item) {
			item.set("quantity", item.get("quantity") + 1);
		});
	}

	store.getSerializedModels = function () {
		var self = this;

		var records = store.where();
		return context.appContext.stores.items.resolveRecordsAndWait(
			records,
			{
				useIdField: "item_id"
			}
		).then(function (models) {

			return models.map(function (model) {

				return model.getAttributes({
					props: true,
					session: true,
					derived: true
				});
			});
		});
	}

	store.resetToSerializedModels = function (models) {

		return COMMON.API.Q.fcall(function () {

			models.forEach(function (model) {
				var record = {};
				Object.keys(context.appContext.stores.items.Model.prototype._definition).forEach(function (name) {
					if (typeof model[name] !== "undefined") {
						record[name] = model[name];
					}
				});
				store.add(record);
			});
		});
	}

	return store;
}

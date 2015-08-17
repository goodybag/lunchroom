
var COMMON = require("./ui._common");


//var ENDPOINT = COMMON.makeEndpointUrl("items");



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


exports['for'] = function (context) {

	var store = new Store();

	store.keepInLocalStorage = true;


	function getLocalStorageNamespace () {
		var ctx = context.appContext.get("context");
		return ctx.dbfilter.consumer_group_id + "." + ctx.dbfilter.event_id;
	}

	function syncToLocalStorage () {
		if (!store.keepInLocalStorage) return;
		COMMON.storeLocalValueFor("cart", getLocalStorageNamespace(), JSON.stringify(store.where().map(function (record) {
			return record.toJSON();
		})));
	}
	store.on("reset", syncToLocalStorage);
	store.on("change", syncToLocalStorage);
	store.on("update", syncToLocalStorage);
	function recoverFromLocalStorage () {
		var records = COMMON.getLocalValueFor("cart", getLocalStorageNamespace());
		if (records) {
			try {
				JSON.parse(records).forEach(function (record) {
					store.add(record);
				});
			} catch (err) {
				console.error("Error recovering cart from local storage");
			}
		}
	}
	setTimeout(function () {
		recoverFromLocalStorage();
	}, 100);


	store.clearAllItems = function () {
		COMMON.storeLocalValueFor("cart", getLocalStorageNamespace(), JSON.stringify([]));
		this.reset();
	}


	store.getSummary = function (options) {

		options = options || {};
		options.tip = options.tip || 0;

		var amount = 0;
		store.where().forEach(function (record) {
			amount += parseInt(record.get("price")) * parseInt(record.get("quantity"));
		});

		var events = context.appContext.get('stores').events;
		var eventToday = events.modelRecords(events.getToday()).pop();

		if (!eventToday) {
			return {};
		}

		amount = Math.round(amount);

		var summary = {
			"amount": amount,
			"format.amount": COMMON.API.NUMERAL(amount/100).format('$0.00'),
			"tax": parseInt(eventToday.get("consumerGroup.orderTax")) || 0,
			"taxAmount": 0,
			"format.tax": "0%",
			"format.taxAmount": "$0.00",
			"goodybagFee": parseInt(eventToday.get("goodybagFee")),
			"format.goodybagFee": eventToday.get("format.goodybagFee"),
			"total": 0,
			"format.total": "$0.00"
		};

		if (
			summary.amount &&
			summary.tax
		) {
			summary["taxAmount"] = Math.round(summary.amount * summary.tax/100 / 100);
			summary["format.tax"] = summary.tax/100 + "%";
			summary["format.taxAmount"] = COMMON.API.NUMERAL(summary["taxAmount"] / 100).format('$0.00');
		}

		if (summary.amount) {
			summary.total = Math.round(
				summary.amount
				+ summary.taxAmount
				+ summary.goodybagFee
//				+ parseInt(options.tip)
			);
			summary["format.total"] = COMMON.API.NUMERAL(summary.total / 100).format('$0.00');
		}

		return summary;
	}


	store.modelRecords = function (records) {

		var Model = context.appContext.get('stores').items.Model;

		return records.map(function (record, i) {
			// Store model on backbone row so we can re-use it on subsequent calls.
			// NOTE: We purposfully store the model using `records[i]` instead of `record`
			//       as `record` 
			if (store._byId[records[i].get("id")].__model) {
				return store._byId[records[i].get("id")].__model;
			}
			var fields = {};
			Model.getFields().forEach(function (field) {
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

	store.getItemCount = function () {
		var count = 0;
		this.where().map(function (item) {
    		count += item.get("quantity");
    	});
    	return count;
	}

	store.getQuantityForItemId = function (itemId) {
		var item = store.where({
			"item_id": itemId
		});
		if (item.length === 0) return 0;
		return item[0].get("quantity");
	}

	store.removeItem = function (itemId, all) {
		var self = this;

		var item = store.where({
			"item_id": itemId
		});
		if (item.length === 0) {
			item = store.get(itemId);
			if (!item) {
				return COMMON.API.Q.resolve();
			}
		} else {
			item = item[0];
		}

		var quantity = item.get("quantity");
		if (quantity > 1 && all !== true) {
			item.set("quantity", quantity - 1);
			store.trigger("change", item);
		} else {
			store.remove(item.get("id"));
			store.trigger("change", null);
		}
		return COMMON.API.Q.resolve();
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
			return require("./ui.Items")['for']({
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
			store.trigger("change", item);
		});
	}

	store.getSerializedModels = function () {
		var self = this;

		var records = store.where();
		return context.appContext.get('stores').items.resolveRecordsAndWait(
			records,
			{
				useIdField: "item_id"
			}
		).then(function (models) {

			return models.map(function (model) {

				return model.getValues();
			});
		});
	}

	store.resetToSerializedModels = function (models) {

		return COMMON.API.Q.fcall(function () {

			models.forEach(function (model) {
				var record = {};
				context.appContext.get('stores').items.Model.getFields().forEach(function (name) {
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

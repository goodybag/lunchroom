
var console = require("../app/lib/console");

var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	var collection = DATA.init({

		name: "cart",

		model: require("./ui.Cart.model").forContext(context),
		record: {
// TODO: Use record and get rid of model

			"@fields": {
				"item_id": {
					"linksTo": "items"
				},
				"event_id": {
					"linksTo": "events"
				}
			}
		},

		collection: {			

			itemCount: function () {
				return this.store.getItemCount();
			},

			getSummary: function () {
				var self = this;

				var amount = 0;

				var daysWithItems = {};
				var tax = null;
				var goodybagFee = 0;
				self.where().forEach(function (record) {
					// NOTE: We grab the tax rate and goodybagFee from the event of the first item
					//       and assume it is the same for all other items.
					if (tax === null) {
						tax = record.get("event_id/consumer_group_id/orderTax");
					}
					if (goodybagFee === 0) {
						goodybagFee = record.get("event_id/goodybagFee");
					}
					daysWithItems[record.get("event_id/day_id")] = true;
					amount += parseInt(record.get("item_id/price")) * parseInt(record.get("quantity"));
				});

				amount = Math.round(amount);

				var summary = {
					"amount": amount,
					"format.amount": COMMON.API.NUMERAL(amount/100).format('$0.00'),
					"tax": parseInt(tax) || 0,
					"taxAmount": 0,
					"format.tax": "0%",
					"format.taxAmount": "$0.00",
					"goodybagFeePerDay": parseInt(goodybagFee),
					"goodybagFee": parseInt(goodybagFee) * Object.keys(daysWithItems).length,
					"total": 0,
					"format.total": "$0.00"
				};

				summary["format.goodybagFeePerDay"] = COMMON.API.NUMERAL(summary.goodybagFeePerDay / 100).format('$0.00');
				if (summary.goodybagFee > 0) {
					summary["format.goodybagFee"] = COMMON.API.NUMERAL(summary.goodybagFee / 100).format('$0.00');
				} else {
					summary["format.goodybagFee"] = '$0.00';
				}

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
					);
					if (summary.total > 0) {
						summary["format.total"] = COMMON.API.NUMERAL(summary.total / 100).format('$0.00');
					} else {
						summary["format.total"] = '$0.00';
					}
				}

				return summary;
			},

			getSerializedForOrder: function () {
				return this.store.where().map(function (record) {
					return record.getAll({
						day_id: "event_id/day_id",
						vendor_id: "item_id/vendor_id",
						title: "item_id/title",
						price: "item_id/price"
					});
				});
			}

		},

		// Low-level
		store: {

			clearAllItems: function () {
				COMMON.storeLocalValueFor("cart", getLocalStorageNamespace(), JSON.stringify([]));
				this.reset();
				return COMMON.API.Q.resolve();
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
					var model = self._byId[records[i].get("id")].__model = new self.Model(fields);
					record.on("change", function (record) {
						for (var name in record.changed) {
							model.set(name, record.changed[name]);
						}
					});
					return model;
				});
			},

			getItemCount: function () {
				var count = 0;
				this.where().map(function (item) {
		    		count += item.get("quantity");
		    	});
		    	return count;
			},

			getQuantityForItemId: function (itemId) {
				var item = this.where({
					"item_id": parseInt(itemId)
				});
				if (item.length === 0) return 0;
				return item[0].get("quantity");
			},

			removeItemForId: function (id, all) {
				var self = this;

				var item = self.get(id);
				if (!item) {
					return COMMON.API.Q.resolve();
				}

				var quantity = item.get("quantity");
				if (quantity > 1 && all !== true) {
					item.set("quantity", quantity - 1);
					self.trigger("change", item);
				} else {
					self.remove(item.get("id"));
					self.trigger("change", null);
				}
				return COMMON.API.Q.resolve();
			},

			removeAllItemsForEvent: function (event_id) {
				var self = this;
				self.where({
					"event_id": parseInt(event_id)
				}).forEach(function (item) {
					self.remove(item.get("id"));
				});
				self.trigger("change", null);
				return COMMON.API.Q.resolve();
			},

			removeItemForEvent: function (event_id, item_id, all) {
				var self = this;

				var item = self.where({
					"event_id": parseInt(event_id),
					"item_id": parseInt(item_id)
				});
				if (item.length === 0) {
					item = self.get(item_id);
					if (!item) {
						return COMMON.API.Q.resolve();
					}
				} else {
					item = item[0];
				}

				var quantity = item.get("quantity");
				if (quantity > 1 && all !== true) {
					item.set("quantity", quantity - 1);
					self.trigger("change", item);
				} else {
					self.remove(item.get("id"));
					self.trigger("change", null);
				}
				return COMMON.API.Q.resolve();
			},

			addItemForEvent: function (event_id, item_id, options) {
				var self = this;

				var options = COMMON.API.CJSON(options || {});

				function ensureItem () {
					return COMMON.API.Q.fcall(function () {

						var optionsHash = new COMMON.API.JSSHA("SHA-1", "TEXT");
						optionsHash.update(options);
						var cartItemId = event_id + "-" + item_id + "-" + optionsHash.getHash("HEX");

						if (self.get(cartItemId)) {
							return self.get(cartItemId);
						}

						self.add({
							id: cartItemId,
							event_id: event_id,
					        item_id: item_id,
					        options: options,
					        quantity: 0						
						});
						return self.get(cartItemId);
					});
				}

				return ensureItem().then(function (item) {
					item.set("quantity", item.get("quantity") + 1);
					self.trigger("change", item);
				});
			},

			resetToSerializedModels: function (models) {
				var self = this;

				return COMMON.API.Q.fcall(function () {

					models.forEach(function (model) {
						var record = {};
						self.Model.getFields().forEach(function (name) {
							if (typeof model[name] !== "undefined") {
								record[name] = model[name];
							}
						});
						self.add(record);
					});
				});
			}

		}
	});



	var store = collection.store;

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



	return collection.store;
}


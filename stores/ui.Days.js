
var COMMON = require("./ui._common");
var DATA = require("./ui._data");



exports['for'] = function (context) {

	var collection = DATA.init({

		name: "days",

		model: require("./ui.Days.model").forContext(context),
		record: {
// TODO: Use record and get rid of model
		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {
// App
			getDayIds: function () {
				return this.where().map(function (day) {
					return day.get("id");
				});
			},
// App
			loadForEvent: function (event_id) {
		// TODO: DEPRECATE
		/*
				var day_id = context.appContext.get('stores').events.get(event_id).get("day_id");

				if (!store.get(day_id)) {
					store.add({
						"id": day_id
					});
				}
		*/
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
					return self._byId[records[i].get("id")].__model = new self.Model(fields);
				});
			}
			
		}
	});


	collection.store.Model.getCurrentDays().forEach(function (day) {
		collection.store.add(day);
	});


	return collection.store;
}


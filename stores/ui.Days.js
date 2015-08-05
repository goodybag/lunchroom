
const COMMON = require("./ui._common");



var Record = COMMON.API.BACKBONE.Model.extend({
	idAttribute: "id"
});

var Store = COMMON.API.BACKBONE.Collection.extend({
	model: Record
});


var store = new Store();

/*
for (var day=0 ; day<=4 ; day++) {
	store.add({
		"id": COMMON.API.MOMENT().add(day, 'days').format("YYYY-MM-DD")
	});
}
*/

exports.for = function (context) {

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		props: {
			id: "string"
	    },
	    derived: {
		    "format.ddd": {
				deps: [
					"id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.id, "YYYY-MM-DD").format("ddd");
	            }
		    }
		}
	});

	store.loadForEvent = function (event_id) {

		var day_id = context.appContext.stores.events.get(event_id).get("day_id");

		if (!store.get(day_id)) {
			store.add({
				"id": day_id
			});
		}

		return COMMON.API.Q.resolve();
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
			Object.keys(Model.prototype._definition).forEach(function (field) {
				if (!records[i].has(field)) return;
				fields[field] = records[i].get(field);
			});
			return store._byId[records[i].get("id")].__model = new Model(fields);
		});
	}

	return store;
}

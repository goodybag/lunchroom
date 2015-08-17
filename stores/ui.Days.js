
var COMMON = require("./ui._common");



var Record = COMMON.API.BACKBONE.Model.extend({
	idAttribute: "id"
});

var Store = COMMON.API.BACKBONE.Collection.extend({
	model: Record
});


var INCLUDE_PRIOR_WEEKEND = false;


var store = new Store();

function makeStartOfWeek () {
	var startOfWeek = COMMON.API.MOMENT().startOf('week');
	// If Saturday or Sunday, jump to next week.
	if (
		COMMON.API.MOMENT().day() === 6// ||
//		COMMON.API.MOMENT().day() === 0
	) {
		startOfWeek.add(7, 'days');
	}
	return startOfWeek;
}

var day = 1;
if (INCLUDE_PRIOR_WEEKEND) {
	day -= 2;
}
for (; day<=5 ; day++) {
	store.add({
		"id": makeStartOfWeek().add(day, 'days').format("YYYY-MM-DD")
	});
}

exports['for'] = function (context) {

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = store.Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "days",
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
		    },
		    "format.MMM-D": {
				deps: [
					"id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.id, "YYYY-MM-DD").format("MMM D");
	            }
		    }
		}
	});

	store.getDayIds = function () {
		return store.where().map(function (day) {
			return day.get("id");
		});
	}

	store.loadForEvent = function (event_id) {
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

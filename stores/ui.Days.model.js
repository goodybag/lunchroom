var console = require("../app/lib/console");


var COMMON = require("./ui._common.model");


var INCLUDE_PRIOR_WEEKEND = false;
var INCLUDE_COMING_WEEKEND = false;


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
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


	Model.getCurrentDays = function () {

		// Initialize without loading data from server for now.
		function makeStartOfWeek () {
			var startOfWeek = common.MOMENT().startOf('week');
			// If Saturday or Sunday, jump to next week.
			if (
				common.MOMENT().day() === 6
//				common.MOMENT().day() === 0
			) {
				startOfWeek.add(7, 'days');
			}
			return startOfWeek;
		}
		var dayStart = 1;
		var dayCount = 5;
		if (INCLUDE_PRIOR_WEEKEND) {
			dayStart -= 2;
		} else
		if (INCLUDE_COMING_WEEKEND) {
			dayCount += 2;
		}
		var days = [];
		for (var day = dayStart; day<=dayCount ; day++) {
			days.push({
				"id": makeStartOfWeek().add(day, 'days').format("YYYY-MM-DD")
			});
		}

		return days;
	}


	return Model;
}

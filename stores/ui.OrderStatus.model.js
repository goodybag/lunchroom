

var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "order-status",
		props: {
			id: "string",
			orderHashId: "string",
			status: "string"
	    }
	});

	Model.latestStatusForRecords = function (records) {

		var status = {
			active: null,
			activeTime: null,
			history: []
		};
		records.forEach(function (record) {
			status.history.push([
				common.MOMENT().utc((record.get && record.get("time")) || record.time).unix(),
				record.get((record.get && record.get("status")) || record.status)
			]);
		});
		status.history.sort(function (a, b) {
			if (a[0] === b[0]) return 0;
			if (a[0] > b[0]) return -1;
			return 1;
		});
		if (status.history.length > 0) {
			status.activeTime = status.history[0][0];
			status.active = status.history[0][1];
		}

		return status;
	}

	return Model;
}

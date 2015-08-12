

// The API for models that works in client and on server.
// Running all API access through here allows for easy porting later.
var API = exports.API = {
	Q: require("q"),
	UNDERSCORE: require('underscore'),
	AMPERSAND_STATE: require('./ampersand-state'),
	MOMENT: require("moment"),
	NUMERAL: require("numeral"),
	UUID: require("uuid"),
	JSSHA: require("jssha"),
	CJSON: require("canonical-json")
};


exports.forAppContext = function (appContext) {

	var exports = {};

	exports.makeFormatter = function (type) {

		if (type === "deliveryTime") {
			return {
				deps: [
					"deliveryStartTime",
					"pickupEndTime"
				],
	            fn: function () {
	            	var deliveryStartTime = API.MOMENT(this.deliveryStartTime);
	            	var pickupEndTime = API.MOMENT(this.pickupEndTime);
	            	return deliveryStartTime.format("hh:mm") + "-" + pickupEndTime.format("hh:mm A");
	            }
		    };
		} else
		if (type === "deliveryDate") {
			return {
				deps: [
					"deliveryStartTime"
				],
	            fn: function () {
	            	var deliveryStartTime = API.MOMENT(this.deliveryStartTime);
	            	return deliveryStartTime.format("dddd, MMM Do YYYY");
	            }
		    };
		}

		throw new Error("Formatter of type '" + type + "' not supported!");
	}

	return exports;
}

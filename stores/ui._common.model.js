

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


exports.forContext = function (context) {

	var exports = {};

	var MOMENT = exports.MOMENT = (
		context &&
		(
			(context.appContext && context.appContext.MOMENT) ||
			context.MOMENT
		)
	) || API.MOMENT;
	var MOMENT_CT = exports.MOMENT_CT = (
		context &&
		(
			(context.appContext && context.appContext.MOMENT_CT) ||
			context.MOMENT_CT
		)
	) || API.MOMENT_CT || MOMENT;

	exports.MOMENT = MOMENT;
	exports.MOMENT_CT = MOMENT_CT;

	exports.makeFormatter = function (type) {

		if (type === "deliveryTime") {
			return {
				deps: [
					"deliveryStartTime",
					"pickupEndTime"
				],
	            fn: function () {
	            	var deliveryStartTime = MOMENT_CT(this.deliveryStartTime);
	            	var pickupEndTime = MOMENT_CT(this.pickupEndTime);
	            	return deliveryStartTime.format("h:mm") + "-" + pickupEndTime.format("h:mm A");
	            }
		    };
		} else
		if (type === "deliveryDate") {
			return {
				deps: [
					"deliveryStartTime"
				],
	            fn: function () {
	            	var deliveryStartTime = MOMENT_CT(this.deliveryStartTime);
	            	return deliveryStartTime.format("dddd, MMM Do YYYY");
	            }
		    };
		} else
		if (type === "deliveryDay") {
			return {
				deps: [
					"deliveryStartTime"
				],
	            fn: function () {
	            	var deliveryStartTime = MOMENT_CT(this.deliveryStartTime);
	            	return deliveryStartTime.format("dddd");
	            }
		    };
		} else
		if (type === "orderByTime") {
			return {
				deps: [
					"orderByTime"
				],
	            fn: function () {
	            	var orderByTime = MOMENT_CT(this.orderByTime);
	            	return orderByTime.format("h:mm A");
	            }
		    };
		} else
		if (type === "menuEmailTime") {
			return {
				deps: [
					"menuEmailTime"
				],
	            fn: function () {
	            	var menuEmailTime = MOMENT_CT(this.menuEmailTime);
	            	return menuEmailTime.format("h:mm A");
	            }
		    };
		} else
		if (type === "menuSmsTime") {
			return {
				deps: [
					"menuSmsTime"
				],
	            fn: function () {
	            	var menuSmsTime = MOMENT_CT(this.menuSmsTime);
	            	return menuSmsTime.format("h:mm A");
	            }
		    };
		}

		throw new Error("Formatter of type '" + type + "' not supported!");
	}

	return exports;
}



var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forAppContext(context.appContext);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "events",
		props: {
			id: "string",
	        day_id: "string",
	        "orderByTime": "string",
	        "deliveryStartTime": "string",
	        "pickupEndTime": "string",
	        "consumer_group_id": "string",
	        "goodybagFee": "string",
	        "tip": "string",
	        "token": "string",
	        "menuReady": "boolean",
	        "menuEmailsSent": "boolean",
	        "delivered": "boolean",
	        "deliveredEmailsSent": "boolean",

	        // TODO: Add these dynamically using foreign model.
	        "consumerGroup.title": "string",
	        "consumerGroup.alias": "string",
	        "consumerGroup.contact": "string",
	        "consumerGroup.address": "string",
	        "consumerGroup.pickupLocation": "string",
	        "consumerGroup.orderTax": "string"
	    },
	    derived: {
		    "day.format.ddd": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("ddd");
	            }
		    },
		    "day.format.MMM": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("MMM");
	            }
		    },
		    "day.format.D": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("D");
	            }
		    },
		    "day.format.dddd-type": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	var str = COMMON.API.MOMENT(this.day_id, "YYYY-MM-DD").format("dd");
	            	if (str === "Sa" || str === "Su") {
	            		return "Weekend"
	            	} else {
	            		return "Weekday"
	            	}
	            }
		    },
		    "ordersLocked": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	return COMMON.API.MOMENT().isAfter(this.orderByTime);
	            }
		    },
		    "canOrder": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = COMMON.API.MOMENT(this.orderByTime);
	            	if (!orderByTime.isSame(COMMON.API.MOMENT(), 'day')) {
	            		// Not today
	            		return false;
	            	}
	            	if (orderByTime.isBefore(COMMON.API.MOMENT())) {
	            		// After deadline
	            		return false;
	            	}
	            	// TODO: Monitor quantities.
	            	return true;
	            }
		    },
		    "format.deliveryDate": common.makeFormatter("deliveryDate"),
		    "format.deliveryTime": common.makeFormatter("deliveryTime"),
		    "format.orderTimer": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = COMMON.API.MOMENT(this.orderByTime);
	            	if (orderByTime.isBefore(COMMON.API.MOMENT())) {
	            		// After deadline
	            		return false;
	            	}
	            	return COMMON.API.MOMENT().to(orderByTime, true)
	            		.replace(/minutes/, "min");
	            }
		    },
		    "format.orderTimerSeconds": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = COMMON.API.MOMENT(this.orderByTime);
	            	var diff = orderByTime.diff(COMMON.API.MOMENT(), 'seconds');
	            	if (diff<0) diff = 0;
	            	return diff;
	            }
		    },		    
		    "format.goodybagFee": {
		    	deps: [
					"goodybagFee"
				],
	            fn: function () {
	            	return COMMON.API.NUMERAL(this.goodybagFee/100).format('$0.00');
	            }
		    },
		    "format.menuReady": {
		    	deps: [
					"menuReady"
				],
				cache: false,
	            fn: function () {
	            	return (this.menuReady ? "Yes" : "No");
	            }
		    },
		    "format.menuEmailsSent": {
		    	deps: [
					"menuEmailsSent"
				],
				cache: false,
	            fn: function () {
	            	return (this.menuEmailsSent ? "Yes" : "No");
	            }
		    },
		    "format.delivered": {
		    	deps: [
					"delivered"
				],
				cache: false,
	            fn: function () {
	            	return (this.delivered ? "Yes" : "No");
	            }
		    },
		    "menuUrl": {
		    	deps: [
					"token"
				],
				cache: false,
	            fn: function () {
	            	return context.appContext.get("windowOrigin") + "/event-" + this.token;
	            }
		    }
	    }
	});

	return Model;
}

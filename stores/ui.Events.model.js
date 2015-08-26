var console = require("../app/lib/console");


var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "events",
		props: {
			id: "string",
	        day_id: "string",
	        "orderByTime": "string",
	        "deliveryStartTime": "string",
	        "pickupEndTime": "string",
	        "menuEmailTime": "string",
	        "menuSmsTime": "string",
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
	        "consumerGroup.deliverLocation": "string",
	        "consumerGroup.orderTax": "string"
	    },
	    derived: {
		    "day.format.ddd": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return common.MOMENT_CT(this.day_id, "YYYY-MM-DD").format("ddd");
	            }
		    },
		    "day.format.MMM": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return common.MOMENT_CT(this.day_id, "YYYY-MM-DD").format("MMM");
	            }
		    },
		    "day.format.D": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	return common.MOMENT_CT(this.day_id, "YYYY-MM-DD").format("D");
	            }
		    },
		    "day.format.dddd-type": {
				deps: [
					"day_id"
				],
	            fn: function () {
	            	var str = common.MOMENT_CT(this.day_id, "YYYY-MM-DD").format("dd");
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
	            	return common.MOMENT_CT().isAfter(this.orderByTime);
	            }
		    },
		    "isPastDeadline": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = common.MOMENT_CT(this.orderByTime);
	            	if (orderByTime.format("ddd") === common.MOMENT_CT().format("ddd")) {
	            		// Event for today. Now see if order deadline has passed.
		            	if (orderByTime.isBefore(common.MOMENT_CT())) {
		            		// After deadline
		            		return true;
		            	}
		            	return false;
	            	} else
	            	// Check if before today
	            	if (orderByTime.isBefore(common.MOMENT_CT().subtract(1, 'day').endOf('day'))) {
		            	return true;
	            	}
	            	return false;
	            }
		    },
		    "canOrder": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = common.MOMENT_CT(this.orderByTime);
	            	if (orderByTime.format("ddd") === common.MOMENT_CT().format("ddd")) {
	            		// Event for today. Now see if order deadline has passed.
		            	if (orderByTime.isBefore(common.MOMENT_CT())) {
		            		// After deadline
		            		return false;
		            	}
		            	return true;
	            	} else
	            	// Check if before today
	            	if (orderByTime.isBefore(common.MOMENT_CT().subtract(1, 'day').endOf('day'))) {
		            	return false;
	            	}
	            	return true;
	            }
		    },

		    "format.deliveryDate": common.makeFormatter("deliveryDate"),
		    "format.deliveryTime": common.makeFormatter("deliveryTime"),
		    "format.orderByTime": common.makeFormatter("orderByTime"),
		    "format.menuEmailTime": common.makeFormatter("menuEmailTime"),
		    "format.menuSmsTime": common.makeFormatter("menuSmsTime"),


		    "format.orderTimer": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = common.MOMENT_CT(this.orderByTime);
	            	if (orderByTime.isBefore(common.MOMENT_CT())) {
	            		// After deadline
	            		return false;
	            	}
	            	return common.MOMENT_CT().to(orderByTime, true)
	            		.replace(/minutes/, "min");
	            }
		    },
		    "format.orderTimerSeconds": {
				deps: [
					"orderByTime"
				],
				cache: false,
	            fn: function () {
	            	var orderByTime = common.MOMENT_CT(this.orderByTime);
	            	var diff = orderByTime.diff(common.MOMENT_CT(), 'seconds');
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
		    },
		    "menuEmailUrl": {
		    	deps: [
					"token"
				],
				cache: false,
	            fn: function () {
	            	return context.appContext.get("windowOrigin") + "/eventemail-" + this.token;
	            }
		    }
	    }
	});

	return Model;
}

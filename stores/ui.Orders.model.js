

var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "orders",
		props: {
			id: "string",
			time: "string",
			orderHashId: "string",
			day_id: "string",
	        form: "object",
	        items: "object",
	        summary: "object",
	        event: "object",
	        "event_id": "string",
	        "deliveryStartTime": "string",
	        "pickupEndTime": "string",
	        "orderFrom": "string",
	        "vendor_ids": "string",
	        "statusInfo": "object",
	        "paymentToken": "object"
	    },
	    derived: {
	    	"format.orderPlacedTime": {
	    		deps: [
					"time"
				],
	            fn: function () {
	            	var time = COMMON.API.MOMENT(this.time);
	            	return time.format("h:mm A");
	            }
	    	},
	    	"format.orderPlacedDateTime": {
	    		deps: [
					"time"
				],
	            fn: function () {
	            	var time = COMMON.API.MOMENT(this.time);
	            	return time.format("dd Do h:mm A");
	            }
	    	},
	    	"format.deliveryTime": common.makeFormatter("deliveryTime"),
	    	"format.deliveryDate": common.makeFormatter("deliveryDate"),
	    	"format.deliveryDay": common.makeFormatter("deliveryDay"),
	    	"event.consumerGroup.contact": {
	    		deps: [
					"event"
				],
	            fn: function () {
	            	if (!this.event) return "";
	            	return JSON.parse(this.event)["consumerGroup.contact"];
	            }
	    	},
	    	"event.consumerGroup.pickupLocation": {
	    		deps: [
					"event"
				],
	            fn: function () {
	            	if (!this.event) return "";
	            	return JSON.parse(this.event)["consumerGroup.pickupLocation"];
	            }
	    	},
	    	"referenceCode3": {
	    		deps: [
					"orderHashId"
				],
	            fn: function () {
	            	return this.orderHashId.substring(0, 3).toUpperCase();
	            }
	    	},
	    	"number": {
	    		deps: [
					"id"
				],
	            fn: function () {
	            	return ""+this.id;
	            }
	    	},
	    	"status.id": {
	    		deps: [
		    		"id",
		    		"orderHashId",
					"statusInfo"
				],
	            fn: function () {
	            	if (
	            		!this.statusInfo &&
	            		this.orderHashId
	            	) {
	            		loadStatusInfoForOrder(this.orderHashId)
	            	}
	            	return (this.statusInfo && this.statusInfo.active) || "new";
	            }
	    	},
	    	"status.format": {
	    		deps: [
					"statusInfo"
				],
	            fn: function () {
	            	if (
	            		!this.statusInfo ||
	            		!this.statusInfo.active
	            	) return "New";
	            	return this.statusInfo.active.substring(0, 1).toUpperCase() + this.statusInfo.active.substring(1);
	            }
	    	},
	    	"customer": {
	    		deps: [
					"form"
				],
	            fn: function () {
	            	var form = JSON.parse(this.form);
	            	return form["info[name]"];
	            }
	    	},
	    	"pickupLocation": {
	    		deps: [
					"event"
				],
	            fn: function () {
	            	var event = JSON.parse(this.event);
	            	return event["consumerGroup.pickupLocation"];
	            }
	    	}
	    }
	});

	return Model;
}

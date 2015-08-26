var console = require("../app/lib/console");


var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "consumer-groups",
		props: {
			id: "string",
	        title: "string",
	        alias: "string",
	        contact: "string",
	        address: "string",
	        pickupLocation: "string",
	        deliverLocation: "string",
	        orderTax: "string",
	        lunchroomLive: "string"
		},
		derived: {
		    "lunchroomUrl": {
		    	deps: [
					"alias"
				],
				cache: false,
	            fn: function () {
	            	return context.appContext.get("windowOrigin") + "/" + this["alias"];
	            }
		    },
		    "format.lunchroomLive": {
		    	deps: [
					"lunchroomLive"
				],
				cache: false,
	            fn: function () {
	            	return (this.lunchroomLive ? "Yes" : "No");
	            }
		    }
		}
	});

	return Model;
}

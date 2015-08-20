

var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "consumer-group-subscriptions",
		props: {
			id: "string",
	        token: "string",
	        consumer_id: "string",
	        consumer_group_id: "string",
	        subscribe_time: "string",
	        confirmed_time: "string",
	        subscribeEmail: "string",
	        confirmedEmail: "string",
	        subscribePhone: "string",

	        "consumerGroup.title": "string"
		},
		derived: {
		    "confirmSubscriptionUrl": {
		    	deps: [
					"token"
				],
				cache: false,
	            fn: function () {
	            	return context.appContext.get("windowOrigin") + "/a/cs/" + this.token;
	            }
		    },
		    "unsubscribeUrl": {
		    	deps: [
					"alias"
				],
				cache: false,
	            fn: function () {
	            	return context.appContext.get("windowOrigin") + "/a/us/" + this.token;
	            }
		    }
		}
	});

	return Model;
}

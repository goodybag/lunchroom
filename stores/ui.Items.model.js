

var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "items",
		props: {
			id: "string",
			item_id: "string",
	        vendor_id: "string",
	        title: "string",
	        description: "string",
	        photo_url: "string",
	        properties: "string",
	        tags: "string",
	        options: "string",
	        price: "integer",
	        quantity: "integer",
			// TODO: Add these dynamically using foreign model.
	        "vendor.title": "string"
	    },
	    derived: {
		    "format.price": {
				deps: [
					"price"
				],
	            fn: function () {
	            	var number = 0;
	            	if (this.price) {
	            		number = this.price / 100;
	            	}
	            	return COMMON.API.NUMERAL(number).format('0.00');
	            }
		    },
		    "format.amount": {
				deps: [
					"price",
					"quantity"
				],
	            fn: function () {
	            	var number = 0;
	            	if (this.price && this.quantity) {
	            		number = (this.price * this.quantity / 100);
	            	}
	            	return COMMON.API.NUMERAL(number).format('0.00');
	            }
		    }
		}
	});

	return Model;
}



var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "menus",
		props: {
			id: "string",
			event_id: "string",
	        item_id: "string",
	        vendor_id: "string",
	        // TODO: Add these dynamically using foreign model.
	        "item.title": "string",
	        "item.photo_url": "string",
	        "item.price": "string",
	        "item.properties": "string",
	        "item.format.price": "string",
	        "item.description": "string",
	        "item.options": "string",
	        "item.tags": "string"
	    },
	    derived: {
		    "cartQuantity": {
				deps: [
					"item_id"
				],
	            fn: function () {
	            	return context.appContext.get('stores').cart.getQuantityForItemId(this.item_id);
	            }
		    }
		}
	});

	return Model;
}

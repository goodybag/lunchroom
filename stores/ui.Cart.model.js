

var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "menus",
		props: {
			id: "string",
			event_id: "integer",
	        item_id: "integer",
	        options: "string",
	        quantity: "integer"
		}
	});

	return Model;
}

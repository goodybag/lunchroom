

var COMMON = require("./ui._common.model");


exports.forContext = function (context) {

	var common = COMMON.forContext(context);

	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		name: "vendors",
		props: {
			id: "string",
	        title: "string",
	        description: "string",
	        adminAccessToken: "string"
	    }
	});

	return Model;
}

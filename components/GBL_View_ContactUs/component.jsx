
const COMPONENT = require("../GBL_ReactComponent");

exports.for = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "ContactUs",

	    render: function () {
	    	var self = this;

	        return {
	        };
	    }
	});

}

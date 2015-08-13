
var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		segmentName: "Footer",

	    render: function () {
	    	var self = this;


console.log("render footer comp");

	        return {};
	    }
	});

}

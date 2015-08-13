
var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

console.log("INIT HEADER COMPONENT", module, Context);

	module.exports = COMPONENT.create(Context, {

		segmentName: "Header",

	    render: function () {
	    	var self = this;

console.log("RENDER HEADER COMPONENT");

	        return {};
	    }
	});

}

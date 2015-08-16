
const DEV = false;

var SERVICES = require("./services");

SERVICES['for']({}).then(function (_SERVICES) {
	SERVICES = _SERVICES;
});


require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.renderEmail = function (template) {

return API.Q.resolve();

    	function loadTemplate () {
	    	return API.Q.fcall(function () {
		    	var templatePath = null;
		    	if (template === "menu") {
		    		templatePath = API.PATH.join(__dirname, "../www/lunchroom-landing~0/components/EmailMenu/email.dot.cjs");
		    	}
		    	if (!templatePath) {
		    		throw new Error("Template '" + template + "' not defined!");
		    	}
		    	return require(templatePath);
	    	});
    	}

    	return loadTemplate().then(function (template) {

    		console.log("DATA", data);

    		return template(data).then(function (html) {

    			return html;
    		});
    	});
    }

});

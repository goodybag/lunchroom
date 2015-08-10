
module.exports = function (CONTEXT) {

	return CONTEXT.wrap(module, {
		'deps': {

			// TODO: Only load if necessary
			"html5shiv": require("resources/html5shiv"),

			"jquery": require("resources/jquery"),
			"bluebird": require("resources/bluebird"),
			"path": require("resources/path"),
			"lodash": require("resources/lodash"),
		    "canonical-json": require("resources/canonical-json"),
			"forge": require("resources/forge"),
		    "moment": require("resources/moment"),
		    "numeral": require("resources/numeral"),
		    "page": require("resources/page"),
		    "underscore": require("resources/underscore"),
		    "backbone": require("resources/backbone"),
		    "react": require("resources/react"),
		    "react-mixin-manager": require("resources/react-mixin-manager"),
		    "react-events": require("resources/react-events"),
		    "react-backbone": require("resources/react-backbone")
		}
	}, Factory);
}

function Factory (CONTEXT) {

	var DEPS = CONTEXT.DEPS;
	var CONFIG = CONTEXT.config;


	CONTEXT.API.Promise = CONTEXT.DEPS['bluebird'];
	CONTEXT.API.Path = CONTEXT.DEPS['path'];


	window.P = function (message) {
		var jquery = (DEPS.jquery || $);
		if (!jquery) return;
		jquery(function () {
			jquery("BODY").append('<p>' + message + '</p>');
		});
	}


	return CONTEXT;
}

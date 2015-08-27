
// @source https://github.com/LogicCores/0-console
// NOTE: This module is UNLICENSE.org by original author ChristophDorn.com

var Q = require("q");

var METHODS = [
	"log",
	"info",
	"warn",
	"error",
	"trace"
];


var Console = function () {
	this._logger = Q.defer();
	this._loggerLoading = false;
}
Console.prototype.setLogger = function (logger) {
	if (!Q.isPending(this._logger.promise)) {
		this._logger = Q.defer();
	}
	this._logger.resolve(logger);
}
Console.prototype.getLogger = function () {
	return this._logger.promise;
}
METHODS.forEach(function (methodName) {

	Console.prototype[methodName] = function () {
		var args = Array.prototype.slice.call(arguments);

		try {
			window.console[methodName].apply(window.console, args);

			// We only queue message for loader if we are in the process of loading it.
			if (!self._loggerLoading) return;

			if (
				methodName === "error" ||
				methodName === "log"
			) {
				this.getLogger().then(function (logger) {

	console.log("got logger", logger);

					logger.log(args);
				});
			}
		} catch (err) {
			try {
				window.console.log(args);
			} catch (err) {}
		}
	};
});

Console.prototype.loadLogger = function (config) {
	var self = this;

	config = config || {};

	if (config.loggly) {
		// We assume that the following script (or equivalent) will eventually be loaded:
		//   <script type="text/javascript" src="http://cloudfront.loggly.com/js/loggly.tracker.js" async></script>
		self._loggerLoading = true;
		Q.denodeify(function (callback) {
			var checkInterval = setInterval(function () {
				if (!window._LTracker) return;
				clearInterval(checkInterval);
				window._LTracker.push(config.loggly);
				return callback(null, {
					log: function (args) {
						window._LTracker.push({
							"app": "lunchroom-client",
							"args": args
						});
					}
				});
			}, 100);
		})().then(function (logger) {
			self.setLogger(logger);
		});
	}
}


module.exports = new Console();
module.exports.Console = Console;


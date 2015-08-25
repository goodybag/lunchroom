
exports['for'] = function (context) {

	var dev = context.appContext.get("context").dev;
	var services = context.appContext.get("context").services;

	var browserConsole = window.console;

	var Q = require("q");

	var exports = {};

	function getLogger () {
		if (!getLogger._logger) {
			getLogger._logger = Q.denodeify(function (callback) {
				var checkInterval = setInterval(function () {
					if (!window._LTracker) return;

					clearInterval(checkInterval);
					if (
						services &&
						services.loggly
					) {
						window._LTracker.push(services.loggly);
						return callback(null, window._LTracker);
					}

					return callback(null, null);
				}, 100);
			})();
		}
		return getLogger._logger;
	}

	exports.getConsole = function () {

		var console = {};
		[
			"log",
			"info",
			"warn",
			"error",
			"trace"
		].forEach(function (type) {
			console[type] = function () {
				var args = Array.prototype.slice.call(arguments);
				getLogger().then(function (logger) {

					browserConsole[type].apply(browserConsole, args);

					if (
						logger &&
						(
							type === "error" ||
							type === "log"
						)
					) {
						logger.push({
							"app": "lunchroom-client",
							"args": args
						});
					}
				});
			};
		});
		return console;
	}

	return exports;
}

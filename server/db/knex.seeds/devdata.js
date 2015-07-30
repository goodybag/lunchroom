
const PATH = require("path");
const QFS = require("q-io/fs");


function getSeedPaths () {
	return QFS.list(PATH.join(__dirname, "../../../stores")).then(function (stores) {
		return stores.filter(function (store) {
			return /\.db$/.test(store);
		}).map(function (store) {
			return PATH.join(__dirname, "../../../stores", store, "db.seed");
		});
	});
}

exports.seed = function (knex, Promise) {

	return getSeedPaths().then(function (seedPaths) {

		return Promise.each(seedPaths, function (seedPath) {

			console.log("Loading db seed from:", seedPath);

			return require(seedPath).seed(knex, Promise);
		});
	});
};


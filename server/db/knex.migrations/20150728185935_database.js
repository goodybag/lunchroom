
function getBasePath () {
	if (process.env.PIO_SERVICE_LIVE_INSTALL_DIRPATH) {
		return process.env.PIO_SERVICE_LIVE_INSTALL_DIRPATH;
	} else {
		return PATH.join(__dirname, "../../..");
	}
}


const PATH = require("path");
const QFS = require(getBasePath() + "/node_modules/q-io/fs");


function getStoresPath () {
	if (process.env.PIO_SERVICE_LIVE_INSTALL_DIRPATH) {
		return PATH.join(process.env.PIO_SERVICE_LIVE_INSTALL_DIRPATH, "stores")
	} else {
		return PATH.join(__dirname, "../../../stores");
	}
}

function getSchemaPaths () {
	return QFS.list(getStoresPath()).then(function (stores) {
		return stores.filter(function (store) {
			return /\.db$/.test(store);
		}).map(function (store) {
			return PATH.join(getStoresPath(), store, "db.schema");
		});
	});
}



exports.up = function (knex, Promise) {

	return getSchemaPaths().then(function (schemaPaths) {

		return Promise.each(schemaPaths, function (schemaPath) {

			console.log("Loading db schema from:", schemaPath);

			return require(schemaPath).up(knex, Promise);
		});
	});
};


exports.down = function (knex, Promise) {

	return getSchemaPaths().then(function (schemaPaths) {

		return Promise.each(schemaPaths, function (schemaPath) {

			console.log("Loading db schema from:", schemaPath);

			return require(schemaPath).down(knex, Promise);
		});
	});
};


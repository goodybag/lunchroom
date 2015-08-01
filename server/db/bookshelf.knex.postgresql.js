
const PATH = require("path");
const FS = require("fs-extra");
const Q = require("q");
const QFS = require("q-io/fs");
const KNEX = require('knex');
const BOOKSHELF = require('bookshelf');
const LIVE_NOTIFY = require("../live-notify");


var knex = null;
var bookshelf = null;

exports.init = function (config, options) {

	config.debug = true;
	config.client = "pg";
	config.migrations = {
		directory: PATH.join(process.env.PIO_SERVICE_DATA_BASEPATH || __dirname, "knex.migrations"),
		tableName: 'migrations'
    };

    if (!FS.existsSync(config.migrations.directory)) {
    	FS.mkdirsSync(config.migrations.directory);
    }

	config.seeds = {
		directory: PATH.join(__dirname, "knex.seeds")
	};


	console.log("DB user", config.connection.user);
	console.log("DB database", config.connection.database);
	console.log("DB host", config.connection.host);
	console.log("DB port", config.connection.port);


	// @see http://knexjs.org/#Installation-node
	knex = KNEX(config);

	// @see http://bookshelfjs.org/#installation
	bookshelf = BOOKSHELF(knex);

	console.log('Running migrations & seeds...');


	function ensureMigration () {

//return knex.raw('SELECT datname FROM pg_database WHERE datistemplate = false;', config).then(function(resp) {
//return knex.raw("SELECT * FROM information_schema WHERE table_schema = 'public';", config).then(function(resp) {
//return knex.raw("DELETE FROM information_schema WHERE table_schema = 'public' AND table_name = 'items';", config).then(function(resp) {
//console.log("resp", resp);
//});

		function rollbackAll () {
			
			console.log('########################################');
			console.log('# Rolling back all migrations ...');
			console.log('########################################');

			function rollback () {
				return knex.migrate.currentVersion().then(function (migrationVersion) {
					
					console.log("migrationVersion", migrationVersion);

					if (migrationVersion === "none") {
						// Nothing more to rollback
						return;
					}
					console.log("Trigger rollback for: " + migrationVersion);
					return knex.migrate.rollback().then(function () {
						return rollback();
					});
				});
			}

			return rollback().then(function () {
				return knex("migrations").del().then(function () {
					return QFS.removeTree(config.migrations.directory).then(function () {
						return QFS.makeDirectory(config.migrations.directory);
					});
				});
			});
		}

		function makeMigration () {
			var nextMigration = "database";
			var nextMigrationSourcePath = PATH.join(__dirname, "database.schema.js");

			console.log('########################################');
			console.log('# Make migration: ' + nextMigration);
			console.log('########################################');

			return knex.migrate.make(nextMigration).then(function (nextMigrationProvisionedPath) {

				// Copy our latest migration to the migrations file.
				return QFS.copy(
					nextMigrationSourcePath,
					nextMigrationProvisionedPath
				).then(function () {
					// There is a migration that needs to be applied.
					return PATH.basename(nextMigrationProvisionedPath);
				});
			});
		}

		function runMigration () {
			console.log('########################################');
			console.log('# Running latest migration ...');
			console.log('########################################');

			return knex.migrate.latest();
		}

		return rollbackAll().then(function () {

			return makeMigration().then(function () {

				return runMigration();
			});
		});
	}


	function runMigrationsAndSeed () {

		if (options.enableAutoMigration !== true) {
			return Q.resolve();
		}

		// TODO: Only run migration and seeds if DB schema has changed.

		return ensureMigration().then(function () {

			console.log('########################################');
			console.log('# Running seeds ...');
			console.log('########################################');
			
			return knex.seed.run();
		});
	}

	return runMigrationsAndSeed().then(function () {

		LIVE_NOTIFY.attachToDatabase(config.connection);

	});
}

exports.getBookshelf = function () {
	if (!bookshelf) {
		throw new Error("Must call 'init()' first!");
	}
	return bookshelf;
}

exports.getKnex = function () {
	if (!knex) {
		throw new Error("Must call 'init()' first!");
	}
	return knex;
}

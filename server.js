
const PATH = require("path");
const FS = require("fs");
const HTTP = require('http');
const SEND = require('send');
const EXPRESS = require("express");
const BODY_PARSER = require('body-parser');
const MORGAN = require('morgan');
const API_ENDPOINTS = require("./server/db/api.endpoints");
const BOOKSHELF_KNEX_POSTGRESQL = require("./server/db/bookshelf.knex.postgresql");
const LIVE_NOTIFY = require("./server/live-notify");
const FIRENODE = require("firenode-for-jsonapi/server");


require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

	function initAPI (app) {

		app.use(MORGAN("combined"));

		app.get(/^(\/(?:vendor|order)-[^\/]+)?(\/.*)$/, function (req, res, next) {

			var path = req.params[1];
			if (path === "/") path = "/index.html";

			if (API.DEBUG) {
				console.log("Template '" + path + "' for url '" + req.url + "'");
			}

			if (
				path === "/index.htm" ||
				path === "/harness.htm"
			) {
				var content = FS.readFileSync(PATH.join(__dirname, "www", path), "utf8");
				content = content.replace(
					/\{\{sessionToken\}\}/,
					encodeURIComponent(JSON.stringify(req._FireNodeContext.sessionToken || null))
				);
				content = content.replace(
					/\{\{encodedContext\}\}/,
					encodeURIComponent(JSON.stringify(req._FireNodeContext.config.clientContext || {}))
				);
				res.writeHead(200, {
					"Content-Type": "text/html"
				});
				return res.end(content);
			}

			return next();
		});

		app.use(BODY_PARSER.urlencoded({extended: true}));
		app.use(BODY_PARSER.json({
			type: [
				'application/json',
				'application/vnd.api+json'
			]
		}));

		var modulesBasePath = PATH.join(__dirname, 'stores');
		FS.readdirSync(modulesBasePath).forEach(function (resource) {
			if (FS.statSync(PATH.join(modulesBasePath, resource)).isDirectory()) {
				if (/\.db$/.test(resource)) {

					console.log("Init DB endpoint for: " + resource);

					API_ENDPOINTS.register(resource);
					app.use(API_ENDPOINTS.endpoint(resource));
				}
			}
		});

		app.get('/api/v1', function (request, response) {
		  response.set('Content-Type', 'application/json');
		  response.send(JSON.stringify(API_ENDPOINTS.index(), null, 2));
		});

		app.get('/api/', function (request, response) {
		  response.redirect('/api/v1');
		});
	}

	function initStatic (app) {

		app.get(/^\/dev\.skin\.style\.css$/, function (req, res, next) {
			return API.REQUEST("https://raw.githubusercontent.com/goodybag/lunchroom-style/clobber/style.css", function (err, response, body) {
				res.writeHead(200, {
					"Content-Type": "text/css"
				});
				return res.end(body);
			});
		});

		app.get(/^\/landing\.skin\.style\.css$/, function (req, res, next) {
			var styleBasePath = require.resolve("07-lunchroom-style/package.json");
			return SEND(req, "/landing.style.css", {
				root: PATH.dirname(styleBasePath)
			}).on("error", next).pipe(res);
		});

		app.get(/^\/skin\.style\.css$/, function (req, res, next) {
			var styleBasePath = require.resolve("07-lunchroom-style/package.json");
			return SEND(req, "/style.css", {
				root: PATH.dirname(styleBasePath)
			}).on("error", next).pipe(res);
		});

		app.get(/^\/components(\/.*(?:\.png|\.jpg))/, function (req, res, next) {
			var path = req.params[0];
			return SEND(req, path, {
				root: PATH.join(__dirname, "components")
			}).on("error", next).pipe(res);
		});

		app.get(/^(\/.*)$/, function (req, res, next) {

			var path = req.params[0];
			if (path === "/") path = "/index.html";

			if (API.DEBUG) {
				console.log("Template '" + path + "' for url '" + req.url + "'");
			}

			if (/\.html?$/.test(path)) {
				// We let privateApp handle route.
				return next();
			}

			return SEND(req, path, {
				root: PATH.join(__dirname, "www")
			}).on("error", function (err) {
				if (err.code === "ENOENT") {
					// We ignore not found errors and proceed to the private routes.
					return next();
				}
				return next(err);
			}).pipe(res);
		});
	}

	var publicApp = EXPRESS();

	publicApp.use(function (req, res, next) {

		var origin = null;
        if (req.headers.origin) {
            origin = req.headers.origin;
        } else
        if (req.headers.host) {
            origin = [
                (API.config.port === 443) ? "https" : "http",
                "://",
                req.headers.host
            ].join("");
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie");
        if (req.method === "OPTIONS") {
            return res.end();
        }

        return next();
	});

	try {
		BOOKSHELF_KNEX_POSTGRESQL.init({
			connection: API.config.db.postgresql
		});
	} catch (err) {
		console.error("Error connecting to PostgreSQL", err.message);
	}
	initStatic(publicApp);

	var privateApp = EXPRESS();
	initAPI(privateApp);

	return FIRENODE.for(API).then(function (FIRENODE) {

		// TODO: Augment this config dynamically by looking at API schema and
		//       security files for each backend route in `./stores`.
		var firenode = new FIRENODE.Server(API.config.firenode, {
			// TODO: Load these dynamically when loading config.
			instances: {
				"07-lunchroom/consumer-group-router/0": API["consumer-group-router"],
				"07-lunchroom/consumer-group-subscription-router/0": API["consumer-group-subscription-router"]
			}
		});

		var server = HTTP.createServer(function (req, res) {

			try {

				publicApp(req, res, function (err) {
					if (err) throw err;

					API.Q.when(firenode.attachToRequest(req, res)).then(function (proceed) {
						if (!proceed) return;

						privateApp(req, res);

					}).fail(function (err) {
						throw err;
					});
				});

			} catch (err) {
				console.error(err.stack);
				res.writeHead(500);
				res.end("Internal Server Error");
			}
		});

		firenode.attachToServer(server);

		LIVE_NOTIFY.attachToClientServer(server);


		server.listen(
			API.config.port,
			API.config.bind
		);

		console.log("Server listening at: http://" + API.config.bind + ":" + API.config.port);

	});

});

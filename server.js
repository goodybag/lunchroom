
if (
	process.env.NODE &&
	/\/\.heroku\//.test(process.env.NODE)
) {
	process.env.PINF_PROGRAM_PATH = __dirname + "/program.heroku.json";
	process.env.VERBOSE = "1";
	process.env.DEBUG = "1";
}


const PATH = require("path");
const FS = require("fs");
const HTTP = require('http');
const SEND = require('send');
const EXPRESS = require("express");
const BODY_PARSER = require('body-parser');
const COMPRESSION = require('compression');
const MORGAN = require('morgan');
const API_ENDPOINTS = require("./server/db/api.endpoints");
const BOOKSHELF_KNEX_POSTGRESQL = require("./server/db/bookshelf.knex.postgresql");
const LIVE_NOTIFY = require("./server/live-notify");
const FIRENODE = require("firenode-for-jsonapi/server");
const UGLIFY = require("uglify-js");
const JOBS = require("./server/jobs");
const EMAILS = require("./server/emails");
const REQUEST = require("request");

const APP_CONTEXT_MODEL = require("./stores/ui.AppContext.model");


require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

	function initPublicApp (app) {

		app.use(COMPRESSION());

		var fileCache = {};

		app.get(/^\/lunchroom-landing~0\/(.+)$/, function (req, res, next) {
			return SEND(req, req.params[0], {
				root: PATH.join(__dirname, "www/lunchroom-landing~0")
			}).on("error", next).pipe(res);
		});

		app.post(/^\/contact-us$/, BODY_PARSER.json({
			type: [
				'application/json'
			]
		}), function (req, res, next) {

			var url = "https://www.goodybag.com/contact-us";

			return REQUEST({
				uri: url,
				method: 'POST',
				json: req.body
			}, function (err, response, body) {
				if (err) return next(err);
				if (response.statusCode !== 200) {
					return next(new Error("Got status '" + response.statusCode + "' while calling '" + url + "'"));
				}
				console.log("Forwarded contact form", req.body, "to", url);
				return res.end(body);
			});
		});

		app.get(/^\/\.landing\.html$/, function (req, res, next) {
			res.writeHead(200, {
				"Content-Type": "text/html",
				"Cache-Control": "max-age=" + (15 * 1000)	// 15 seconds
			});
			res.end("Hello from landing page");
		});

		app.get(/^\/dev\.skin\.style\.css$/, function (req, res, next) {

			try {
				var styleBasePath = require.resolve("07-lunchroom-style/package.json");
				return SEND(req, "/style.css", {
					root: PATH.dirname(styleBasePath)
				}).on("error", next).pipe(res);
			} catch (err) {}

			res.writeHead(200, {
				"Content-Type": "text/css"
			});
			if (fileCache["/style.css"]) {
				return res.end(fileCache["/style.css"]);
			}
			return API.REQUEST("https://raw.githubusercontent.com/goodybag/lunchroom-style/clobber/style.css", function (err, response, body) {
				fileCache["/style.css"] = body;
				return res.end(body);
			});
		});
/*
		app.get(/^\/landing\.skin\.style\.css$/, function (req, res, next) {

			try {
				var styleBasePath = require.resolve("07-lunchroom-style/package.json");
				return SEND(req, "/landing.style.css", {
					root: PATH.dirname(styleBasePath)
				}).on("error", next).pipe(res);
			} catch (err) {}

			res.writeHead(200, {
				"Content-Type": "text/css"
			});
			if (fileCache["/landing.style.css"]) {
				return res.end(fileCache["/landing.style.css"]);
			}
			return API.REQUEST("https://raw.githubusercontent.com/goodybag/lunchroom-style/clobber/landing.style.css", function (err, response, body) {
				fileCache["/landing.style.css"] = body;
				return res.end(body);
			});			
		});
*/
		app.get(/^\/skin\.style\.css$/, function (req, res, next) {
			var styleBasePath = require.resolve("07-lunchroom-style/package.json");
			return SEND(req, "/style.css", {
				root: PATH.dirname(styleBasePath)
			}).on("error", next).pipe(res);
		});

		app.get(/^\/bundle\.js$/, function (req, res, next) {
			var path = req.params[0];
			return SEND(req, "bundle.js", {
				root: PATH.join(__dirname, ".components.built")
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

	function initPrivateApp (app) {

		app.use(MORGAN("combined"));

		function getResourceMappingsForSkinPage (pageId) {
			var descriptor = require("./www/lunchroom-landing~0/hoisted.json");
			var resources = {
				css: null,
				js: {
					lib: null,
					app: null
				}
			};
			descriptor.pages[pageId].resources.forEach(function (resource) {

				if (resource.type === "js") {
					var bundle = resource.uriPath.match(/dist~([^-]+)-[^\.]+\.js$/)[1];
					if (resources[resource.type][bundle]) {
						throw new Error("Each resource type for bundle '" + bundle + "' should only exist once! Make sure everything is inlined.");
					}
					resources[resource.type][bundle] = resource.uriPath;

				} else {
					if (resources[resource.type]) {
						throw new Error("Each resource type should only exist once! Make sure everything is inlined.");
					}
					resources[resource.type] = resource.uriPath;
				}
			});
			return resources;
		}

		var landingResources = getResourceMappingsForSkinPage("Landing");
		var appResources = getResourceMappingsForSkinPage("AppMenu");

		app.get(/^(\/eventemail-[^\/]+)$/, function (req, res, next) {

			var contextConfig = API.config["jobAppContext"] || {};
			contextConfig = API.DEEPMERGE(contextConfig, API.config["jobAppContext[APP_DOMAIN='" + process.env.APP_DOMAIN + "']"] || {});

			return EMAILS.for({
				args: {
					appContext: APP_CONTEXT_MODEL.makeContextForClient(contextConfig),
					config: req._FireNodeContext.config
				}
			}).then(function (EMAILS) {
				return EMAILS.renderEmail("menu", {
					event_id: req._FireNodeContext.session.dbfilter.event_id
				}).then(function (html) {

					res.writeHead(200, {
						"Content-Type": "text/html"
					});
					return res.end(html);
				});
			}).fail(next);
		});

		app.get(/^(\/(?:vendor|order|event)-[^\/]+)?(\/.*)$/, function (req, res, next) {

			var path = req.params[1];
			if (path === "/") path = "/index.html";

			if (API.DEBUG) {
				console.log("Template '" + path + "' for url '" + req.url + "'");
			}

			if (/\.html?/.test(path)) {
				var content = FS.readFileSync(PATH.join(__dirname, "www", path), "utf8");

				content = content.replace(/\{\{adminSkinCssUrl\}\}/g, req._FireNodeContext.config.adminSkinCssUrl || "");
				content = content.replace(/\{\{assetsCssUrl\}\}/g, req._FireNodeContext.config.assetsCssUrl || "");
				content = content.replace(/\{\{assetsJsUrl\}\}/g, req._FireNodeContext.config.assetsJsUrl || "");
				content = content.replace(/\{\{bundleJsUrl\}\}/g, req._FireNodeContext.config.bundleJsUrl || "");

//				content = content.replace(/\{\{landingSkinCssUrl\}\}/g, landingResources.css);
//				content = content.replace(/\{\{landingSkinLibJsUrl\}\}/g, landingResources.js.lib);
//				content = content.replace(/\{\{landingSkinAppJsUrl\}\}/g, landingResources.js.app);

				content = content.replace(/\{\{skinCssUrl\}\}/g, appResources.css);
				content = content.replace(/\{\{skinLibJsUrl\}\}/g, appResources.js.lib);
				content = content.replace(/\{\{skinAppJsUrl\}\}/g, appResources.js.app);

				content = content.replace(
					/\{\{sessionToken\}\}/g,
					encodeURIComponent(JSON.stringify(req._FireNodeContext.sessionToken || null))
				);

				var clientContext = (req._FireNodeContext.config.clientContext || {});
				var session = req._FireNodeContext.session;
				clientContext.dbfilter = ((session && session.dbfilter) || {});

				content = content.replace(
					/\{\{encodedContext\}\}/g,
					encodeURIComponent(JSON.stringify(clientContext))
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

		var postgresqlConfig = {};
		for (var id in API.config.db) {
			var m = id.match(/^postgresql(\[([^=]+)='([^\]]+)'\])?$/);
			if (m) {
				if (m[2]) {
					if (typeof process.env[m[2]] !== "string") {
						throw new Error("Environment variable '" + m[2] + "' must be set!");
					}
					if (m[3] === process.env[m[2]]) {
						postgresqlConfig = API.DEEPMERGE(postgresqlConfig, API.config.db[id]);
					}
				} else {
					postgresqlConfig = API.DEEPMERGE(postgresqlConfig, API.config.db[id]);
				}
			}
		}

		BOOKSHELF_KNEX_POSTGRESQL.init({
			connection: postgresqlConfig
		}).then(function (db) {

			var contextConfig = API.config["jobAppContext"] || {};
			contextConfig = API.DEEPMERGE(contextConfig, API.config["jobAppContext[APP_DOMAIN='" + process.env.APP_DOMAIN + "']"] || {});

			return JOBS.for({
				args: {
					appContext: APP_CONTEXT_MODEL.makeContextForClient(contextConfig)
				}
			}).then(function (JOBS) {

				return JOBS.monitorDatabase(db);
			});

		}).fail(function (err) {
			throw err;
		});

	} catch (err) {
		console.error("Error connecting to PostgreSQL", err.message);
	}
	initPublicApp(publicApp);

	var privateApp = EXPRESS();
	initPrivateApp(privateApp);

	return FIRENODE.for(API).then(function (FIRENODE) {

		// TODO: Augment this config dynamically by looking at API schema and
		//       security files for each backend route in `./stores`.
		var firenode = new FIRENODE.Server(API.config.firenode, {
			// TODO: Load these dynamically when loading config.
			instances: {
				"07-lunchroom/vendor-router/0": API["vendor-router"],
				"07-lunchroom/order-router/0": API["order-router"],
				"07-lunchroom/event-router/0": API["event-router"],
				"07-lunchroom/consumer-group-router/0": API["consumer-group-router"],
				"07-lunchroom/consumer-group-subscription-router/0": API["consumer-group-subscription-router"]
			}
		});

		var server = HTTP.createServer(function (req, res) {

			try {

				publicApp(req, res, function (err) {
					if (err) {
						console.error(err.stack);
						res.writeHead(500);
						res.end("Internal Server Error");
						return;
					}

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


		if (API.config.bind) {
			server.listen(parseInt(API.config.port), API.config.bind);
		} else {
			server.listen(parseInt(API.config.port));
		}

		console.log("Server listening at: http://" + API.config.bind + ":" + API.config.port);

	});

});

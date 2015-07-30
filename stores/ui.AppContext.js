
const COMMON = require("./ui._common");
const UNDERSCORE = require('underscore');
const PAGE = require('page');
const AMPERSAND_STATE = require('ampersand-state');
const MOMENT = require("moment");
const HEAD = head;

exports.for = function (overrides) {

	// TODO: Init from session.
	var config = {
		context: JSON.parse(decodeURIComponent($('head > meta[name="app.context"]').attr("value"))),
		initialized: false,
		ready: false,
	    selectedView: "",
	    // When navigating away from from the 'lockedView' we will do a REDIRECT instead of a PUSH-STATE
	    lockedView: "",
	    selectedDay: MOMENT().add(0, 'days').format("ddd"),
	    todayId: MOMENT().format("YYYY-MM-DD"),
	    today: MOMENT().format("ddd")
	};

	UNDERSCORE.extend(config, overrides || {});

	if (config.context.skinUri) {
		HEAD.load([
			config.context.skinUri + "?t=" + Date.now()
		]);
	}

	var appContext = new AppContext(config);


	const PATHNAME = window.location.pathname;

	function handleSelectedViewInit () {

		if (appContext.context.id) {

			if (!(
				appContext.selectedView === "Order_Placed" ||
				appContext.selectedView === "Order_Arrived" ||
				appContext.selectedView === "Receipt"
			)) {

				// Break out of order context if admin link is clicked.
				if (/^Admin_/.test(appContext.selectedView)) {
					var pathParts = PATHNAME.split("/");
					pathParts.splice(1, 1);
					var url = window.location.origin + pathParts.join("/") + "#" + appContext.selectedView;
					window.location.href = url;
					return true;
				}

				appContext.selectedView = "Receipt";
				return true;
			}

		} else {

			if (
				appContext.selectedView === "Order_Placed" ||
				appContext.selectedView === "Order_Arrived" ||
				appContext.selectedView === "Receipt"
			) {				
				if (!appContext.stores.orders.getOrder(appContext.todayId).get("items")) {
					// Redirect to menu because there is no placed order.
					appContext.selectedView = "Menu_Web";
					return true;
				}
			} else
			if (!appContext.selectedView) {
				appContext.selectedView = "Menu_Web";
				return true;
			}
		}

		return false;
	}


	// Page / (top-level view) management
	function initPageManagement () {

		PAGE('*', function load(ctx) {
			var pathname = ctx.pathname;

			var view = pathname.replace(PATHNAME, "").replace(/^#/, "");

			if (
				/^\//.test(pathname) &&
				appContext.lockedView &&
				pathname !== appContext.lockedView
			) {
				// We are selecting a new view and updating the URL using a REDIRECT which
				// loads the new page from the server.

				// NOTE: This will not work if only the Hash changes.
				//       In those cases you need to redirect to a new URL.
				window.location.href = window.location.origin + PATHNAME + view;
			} else {

				// We are selecting a new view and updating the URL using PUSH-STATE
				// without reloading the page.

				appContext.selectedView = view;
			}
		});
		PAGE();

		appContext.on("change:selectedView", function () {

			if (
				appContext.lockedView &&
				appContext.selectedView !== appContext.lockedView
			) {
				// We are selecting a new view and updating the URL using a REDIRECT which
				// loads the new page from the server.

				// NOTE: This will not work if only the Hash changes.
				//       In those cases you need to redirect to a new URL.
				window.location.href = window.location.origin + PATHNAME + "#" + appContext.selectedView;
			} else {

				// We are selecting a new view and updating the URL using PUSH-STATE
				// without reloading the page.

				if (handleSelectedViewInit()) return;
				PAGE(PATHNAME + "#" + appContext.selectedView);
			}
		});

		appContext.on("change:selectedDay", function () {
			if (appContext.selectedView != "Landing") {
				appContext.selectedView = "Landing";
			}
		});
	}

	function initLiveNotify () {

		var client = require("socket.io/node_modules/socket.io-client/lib/index.js");
		var socket = client.connect(window.location.origin);

		// TODO: Handle re-connects by re-sending init.

		// Init connection
		socket.emit('context', appContext.context || {});

		socket.on('notify', function (data) {

			if (data.collection === "order-status") {

				appContext.stores.orderStatus.fetchStatusInfoForOrderHashId(data.orderHashId);

			}
		});
	}

	initPageManagement();

	appContext.on("change:initialized", function () {

		function finalizeInit () {

			initLiveNotify();

			COMMON.init({
// TODO: Config ...
			});

			appContext.ready = true;
		}

		var context = appContext.context;

		var m = PATHNAME.match(/\/(order|vendor)-([^\/]+)\//);
		if (m) {
			context.type = m[1];
			context.id = m[2];
		}

		if (context.selectedView) {
			appContext.selectedView = context.selectedView;
		}
		if (context.lockedView) {
			appContext.lockedView = context.lockedView;
		}

		// We have a context ID that we should use to load
		// data to init the UI.
		if (context.type === "order") {

			appContext.stores.orders.loadOrderByHashId(context.id).then(function () {

				if (!(
					appContext.selectedView === "Order_Placed" ||
					appContext.selectedView === "Order_Arrived" ||
					appContext.selectedView === "Receipt"
				)) {
					appContext.selectedView = "Receipt";
				}

				finalizeInit();

			}).fail(function (err) {
				console.error("Error loading order!", err.stack);
			});

		} else
		if (context.type === "vendor") {

			appContext.stores.vendors.idForAdminAccessToken(context.id).then(function (vendor_id) {

				context.vendor_id = vendor_id;

				return appContext.stores.orders.loadForVendorId(context.vendor_id).then(function () {

					if (!(
						appContext.selectedView === "Admin_Restaurant"
					)) {
						appContext.selectedView = "Admin_Restaurant";
					}

					finalizeInit();
				});
			}).fail(function (err) {
				console.error("Error loading for vendor!", err.stack);
			});

		} else {

			handleSelectedViewInit();
			finalizeInit();
		}
	});

	return appContext;
}


// @see http://ampersandjs.com/docs#ampersand-state
var AppContext = AMPERSAND_STATE.extend({
	props: {
		context: "object",
		initialized: "boolean",
		ready: "boolean",
        skin: "object",
        stores: "object",
        today: "string",
        todayId: "string"
	},
    session: {
        selectedView: "string",
        selectedDay: "string"
    },
    derived: {
        // The skin (config & components) for the active view.
    	view: {
			deps: [
				"skin",
				"selectedView"
			],
            fn: function () {

				var view = this.skin.views[this.selectedView] || {};

				// Init minimal view if skin does not set anything specific.
				if (!view.components) {
					view.components = {};
				}
				if (!view.components["Header"]) {
					view.components["Header"] = "";
				}
				if (!view.components["Menu"]) {
					view.components["Menu"] = "";
				}
				if (!view.components["Footer"]) {
					view.components["Footer"] = "";
				}

				return view;
            }
    	},
	    views: {
			deps: [
				"skin"
			],
            fn: function () {
            	var views = {};
            	for (var viewAlias in this.skin.views) {
            		views[viewAlias] = {
            			alias: viewAlias,
            			label: viewAlias.replace(/_/g, " > "),
            			group: this.skin.views[viewAlias].group || null,
            			container: this.skin.views[viewAlias].container || null,
            			component: this.skin.views[viewAlias].component,
            			config: this.skin.views[viewAlias].config
            		};
            	}
                return views;
            }
	    }
    }
});


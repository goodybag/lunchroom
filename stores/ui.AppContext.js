
var COMMON = require("./ui._common");
var UNDERSCORE = require('underscore');
var PAGE = require('page');
var MOMENT = require("moment");
var Q = require("q");
var HEAD = head;

var Model = require("./ui.AppContext.model");


exports['for'] = function (overrides) {

	var config = {
		sessionToken: JSON.parse(decodeURIComponent($('head > meta[name="session.token"]').attr("value"))),
		context: JSON.parse(decodeURIComponent($('head > meta[name="app.context"]').attr("value"))),
	    selectedDay: MOMENT().format("ddd"),
	    selectedDayId: MOMENT().format("YYYY-MM-DD"),
	    windowOrigin: window.location.origin || (window.location.protocol + "//" + window.location.host),
	    forceAllowOrder: false
	};

	COMMON.API.UNDERSCORE.extend(config, overrides || {});


	var appContext = Model.makeContextForClient(config);


	COMMON.init(appContext.get('sessionToken'), appContext.get('context'));


	var PATHNAME = window.location.pathname;
//console.log("PATHNAME1: " + PATHNAME);
//for (var name in window.location) {
//	console.log("  "+name+": " + window.location[name]);
//}

	function handleSelectedViewInit () {

		if (appContext.get('context').id) {

/*
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
*/

		} else {
/*
			if (
				appContext.get('selectedView') === "Order_Placed" ||
				appContext.get('selectedView') === "Order_Arrived" ||
				appContext.get('selectedView') === "Receipt"
			) {				
				if (!appContext.get('stores').orders.getOrder(appContext.get('todayId')).get("items")) {
					// Redirect to menu because there is no placed order.
					appContext.set('selectedView', "Menu_Web");
					return true;
				}
			} else
*/

			if (!appContext.get('selectedView')) {
				appContext.set('selectedView', "Menu_Web");
				return true;
			}
		}

		return false;
	}


	// Page / (top-level view) management
	function initPageManagement () {

		PAGE('*', function load(ctx) {
			try {

				var pathname = ctx.pathname;
	//debugger;
	//console.log("ON PAGE CHANGE ctx", ctx);

				// IE Fix
				if (
					pathname !== PATHNAME &&
					pathname.indexOf("#") === -1
				) {
					pathname = PATHNAME + "#" + pathname.substring(1);
				}

//console.log("pathname1: " + pathname);

				var view = pathname.replace(PATHNAME, "").replace(/^#/, "");

//console.log("view: " + view);
//console.log("pathname2: " + pathname);
				if (
					/^\//.test(view) &&
					appContext.get('lockedView') &&
					view !== appContext.get('lockedView') &&
					appContext.get('lockedView').split(",").indexOf(view) === -1
				) {
	//console.log("REDIRECT TO", window.location.origin + view);
					// We are selecting a new view and updating the URL using a REDIRECT which
					// loads the new page from the server.

					// NOTE: This will not work if only the Hash changes.
					//       In those cases you need to redirect to a new URL.
					window.location.href = appContext.get("windowOrigin") + view;
				} else {
//console.log("SET VIEW", view);

					// We are selecting a new view and updating the URL using PUSH-STATE
					// without reloading the page.

					appContext.set('selectedView', view);
				}
			} catch (err) {
				console.error("page changed error:", err.stack);
			}
		});
		PAGE({
			popstate: false,
			click: false
		});

		appContext.on("change:selectedView", function () {

			try {

	//console.log("ON VIEW CHANGE appContext.selectedView", appContext.selectedView);
	//console.log("ON VIEW CHANGE appContext.lockedView", appContext.lockedView);

				if (
					appContext.get('lockedView') &&
					appContext.get('selectedView') !== appContext.get('lockedView') &&
					appContext.get('lockedView').split(",").indexOf(appContext.get('selectedView')) === -1
				) {
	//console.log("REDIRECT TO", window.location.origin + PATHNAME + "#" + appContext.selectedView);
					// We are selecting a new view and updating the URL using a REDIRECT which
					// loads the new page from the server.

					// NOTE: This will not work if only the Hash changes.
					//       In those cases you need to redirect to a new URL.
					window.location.href = appContext.get("windowOrigin") + PATHNAME + "#" + appContext.get('selectedView');
				} else {

	//console.log("SET PAGE1", PATHNAME + "#" + appContext.selectedView);

					// We are selecting a new view and updating the URL using PUSH-STATE
					// without reloading the page.

					if (handleSelectedViewInit()) return;
	//console.log("SET PAGE2", PATHNAME + "#" + appContext.selectedView);

					PAGE.redirect(PATHNAME + "#" + appContext.get('selectedView'));

	//				PAGE(PATHNAME + "#" + appContext.selectedView);
	//console.log("SET PAGE DONE", PATHNAME + "#" + appContext.selectedView);

					window.scrollTo(0, 0);
				}
			} catch (err) {
				console.error("selectedView change error:", err.stack);
			}
		});
/*
		appContext.on("change:selectedDay", function () {
			if (appContext.get('selectedView') != "Landing") {
				appContext.set('selectedView', "Landing");
			}
		});
*/
	}

	function initLiveNotify () {
		try {

			var client = require("socket.io/node_modules/socket.io-client/lib/index.js");
			var socket = client.connect(appContext.get("windowOrigin"));

			// TODO: Handle re-connects by re-sending init.

			// Init connection
			socket.emit('context', appContext.get('context') || {});

			socket.on('notify', function (data) {

				if (data.collection === "order-status") {

					appContext.get('stores').orderStatus.fetchStatusInfoForOrderHashId(data.orderHashId);

				}
			});

		} catch (err) {
			console.error("Error initializing live notify:", err.stack);
		}
	}

	initPageManagement();

	appContext.on("change:initialized", function () {

		try {

			function finalizeInit () {

				var context = appContext.get('context');

				if (context.initLiveNotify) {
					initLiveNotify();
				}

				appContext.set('ready', true);
			}

			var context = appContext.get('context');

			var m = PATHNAME.match(/\/(order|vendor|event)-([^\/]+)\/?/);
			if (m) {
				context.type = m[1];
				context.id = m[2];
			}

			if (context.selectedView) {
				appContext.set('selectedView', context.selectedView);
			}
			if (context.lockedView) {
				appContext.set('lockedView', context.lockedView);
			}

			// We have a context ID that we should use to load
			// data to init the UI.
			if (context.type === "order") {

				// When loading order confirmation we don't want to keep cart in local storage.
				appContext.get('stores').cart.keepInLocalStorage = false;

				appContext.get('stores').orders.loadOrderByHashId(context.id).then(function (order) {

					context.dbfilter.event_id = JSON.parse(order.get("event")).id

					return appContext.get('stores').events.loadForId(context.dbfilter.event_id).then(function (event) {

						return appContext.get('stores').consumerGroups.loadForId(event.get("consumer_group_id")).then(function () {

							if (!(
								appContext.get('selectedView') === "Order_Placed" ||
								appContext.get('selectedView') === "Order_Arrived" ||
								appContext.get('selectedView') === "Receipt"
							)) {
								appContext.set('selectedView', "Receipt");
							}

							finalizeInit();
						});
					});

				}).fail(function (err) {
					console.error("Error loading order!", err.stack);
				});

			} else
			if (context.type === "event") {

				if (context.dbfilter.consumer_group_id) {				

					return appContext.get('stores').events.loadForConsumerGroupId(context.dbfilter.consumer_group_id).then(function (events) {
						return appContext.get('stores').menus.loadForEvents(events.map(function (event) {
							return event.get('id');
						}));
					}).then(function () {

						var today = appContext.get('stores').events.modelRecords(appContext.get('stores').events.getToday())[0];

						function monitorOrderDeadline (today) {
							var ordersLocked = null;
							var interval = setInterval(function () {
								try {
									if (!today) return;
									if (ordersLocked === null) {
										ordersLocked = today.get("ordersLocked");
									} else
									if (today.get("ordersLocked") !== ordersLocked) {
										ordersLocked = today.get("ordersLocked");
										// Status has changed so we reload to lock the UI.
										console.log("Lock event due to ordersLocked");
										appContext.get('stores').events.loadForId(context.dbfilter.event_id).fail(function (err) {
											console.error("Error loading event", err.stack);
										});
									}
									if (ordersLocked && interval) {
										clearInterval(interval);
										interval = null;
									}
								} catch (err) {
									console.error("Error monitoring order deadline:", err.stack);
								}
							}, 5 * 1000);
						}

						monitorOrderDeadline(today);


						finalizeInit();

					}).fail(function (err) {
						console.error("Error loading data", err.stack);
					});

	/*
						var today = appContext.get('stores').events.modelRecords(appContext.get('stores').events.getToday())[0];

						function monitorOrderDeadline (today) {
							var ordersLocked = null;
							var interval = setInterval(function () {
								if (ordersLocked === null) {
									ordersLocked = today.ordersLocked;
								} else
								if (today.ordersLocked !== ordersLocked) {
									ordersLocked = today.ordersLocked;
									// Status has changed so we reload to lock the UI.
									console.log("Lock event due to ordersLocked");
									appContext.get('stores').events.loadForId(context.dbfilter.event_id).fail(function (err) {
										console.error("Error loading event", err.stack);
									});
								}
								if (ordersLocked && interval) {
									clearInterval(interval);
									interval = null;
								}
							}, 5 * 1000);
						}

						monitorOrderDeadline(today);
	*/
				}

			} else
			if (context.type === "vendor") {

				appContext.get('stores').vendors.idForAdminAccessToken(context.id).then(function (vendor_id) {

					context.vendor_id = vendor_id;

					return appContext.get('stores').orders.loadForVendorId(context.vendor_id).then(function () {
	/*
						if (!(
							appContext.get('selectedView') === "Admin_Restaurant"
						)) {
							appContext.set('selectedView', "Admin_Restaurant");
						}
	*/

						finalizeInit();
					});
				}).fail(function (err) {
					console.error("Error loading for vendor!", err.stack);
				});

			} else {

				function initializeDefaultsForContext () {
					var all = [];
					if (
						context.dbfilter
					) {

						if (context.type === "lunchroom") {
							if (context.dbfilter.consumer_group_id) {
								all.push(Q.fcall(function () {
									return appContext.get('stores').consumerGroups.loadForId(
										context.dbfilter.consumer_group_id
									);
								}));
							}
						}

						if (context.dbfilter.email) {
							all.push(Q.fcall(function () {
								return appContext.get('stores').consumerGroupSubscriptions.loadForEmail(
									context.dbfilter.email
								);
							}));
						}
					}
					return Q.all(all);
				}

				return initializeDefaultsForContext().then(function () {

					handleSelectedViewInit();
					finalizeInit();

				}).fail(function (err) {
					console.error("Error initializing context", err);
					throw err;
				});
			}
		} catch (err) {
			console.error("Error while initializing:", err.stack);
		}		
	});

	return appContext;
}


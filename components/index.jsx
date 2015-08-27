'use strict'

var console = require("../app/lib/console");

require("./index.less");
require("./index.css");
require("semantic-ui-css/semantic.js");

var React = require('react');
var Backbone = require('backbone');
Backbone.$ = window.$;
require('react-backbone/react-backbone.js');


// ##################################################
// # Application Harness
// ##################################################

function getSkin () {
	var skin = $("body").attr("skin");
	// TODO: Do this dynamically so we don't need to pre-load views into same bundle.
	if (skin === "app") {
		return require("./skin.app.js");
	} else {
		return require("./skin.semantic-ui.js");
	}
}

function initAppContext (skin) {
	var storeContext = {};

	var DATA = require("../stores/ui._data");
	DATA.setSeedData(window.appData || {});

	var appContext = require("../stores/ui.AppContext")['for']({
		stores: {
			page: require("../stores/ui.Page")['for'](storeContext),
			days: require("../stores/ui.Days")['for'](storeContext),
			events: require("../stores/ui.Events")['for'](storeContext),
			items: require("../stores/ui.Items")['for'](storeContext),
			vendors: require("../stores/ui.Vendors")['for'](storeContext),
			menus: require("../stores/ui.Menus")['for'](storeContext),
			consumers: require("../stores/ui.Consumers")['for'](storeContext),
			consumerGroups: require("../stores/ui.ConsumerGroups")['for'](storeContext),
			consumerGroupSubscriptions: require("../stores/ui.ConsumerGroupSubscriptions")['for'](storeContext),
			cart: require("../stores/ui.Cart")['for'](storeContext),
			orders: require("../stores/ui.Orders")['for'](storeContext),
			orderItems: require("../stores/ui.OrderItems")['for'](storeContext)
		},
		skin: skin,
		data: DATA
	});
	storeContext.appContext = appContext;



	appContext.on("change:ready", function () {

		if (!appContext.get('context').dev) return;

		setTimeout(function () {

			$('#form-subscribe input[type="email"]').val("cadorn.test@gmail.com");

		}, 1000);
	});


	appContext.redirectTo = function (contextId, viewId) {

		var url = window.location.origin + '/' + contextId;
		if (viewId) {
			url += '#' + viewId;
		}

		console.log("Redirect to", url);

		window.location.href = url;
	}

	return appContext;
}


// ##################################################
// # Initialize UI and attach to DOM & Context
// ##################################################

try {

	var skin = getSkin();
	var appContext = initAppContext(skin);

	console.log("START INIT!");

	appContext.set('initialized', true);

	$(function () {

		try {

			console.log("START RENDER!");

			if (typeof window.attachSkinApp === "function") {
				window.attachSkinApp({
					initSkinDev: false
				}, function (helpers) {
					appContext.set('skinHelpers', helpers);
				});
			}

			var reactComponent = React.render(
				<skin.RootView appContext={appContext}/>,
				$("#GBL_DEV_Views").get(0)
			);

			function runReady () {
				console.log("RUN READY!");
				reactComponent._trigger_forceUpdate();
				$('#page-loading-indicator').toggleClass('show', false);
			}

			if (appContext.get("ready")) {
				console.log("ALREADY ready! TRIGGER runReady");
				runReady();
			} else {
				appContext.on("change:ready", function () {
					console.log("GOT READY!");
					runReady();
				});
			}

		} catch (err) {
			console.error("Error while attaching to DOM:", err.stack || err.message || err);
		}

	});

} catch (err) {
	console.error("Fatal error while booting app:", err.stack || err.message || err);
}


/** @jsx React.DOM */
'use strict'


// ##################################################
// # Style and Skin related
// ##################################################

require("./index.less");
require("./index.css");

function getSkin () {
	var skin = $("body").attr("skin");
	// TODO: Do this dynamically so we don't need to pre-load views into same bundle.
	if (skin === "app") {
		return require("./skin.app.js");
	} else {
		return require("./skin.semantic-ui.js");
	}
}


require("semantic-ui-css/semantic.js");


// ##################################################
// # Load and configure libraries
// ##################################################


var React = require('react');
var Backbone = require('backbone');
Backbone.$ = window.$;
require('react-backbone/react-backbone.js');



// ##################################################
// # Initialize Globals
// ##################################################

//var _ = require('underscore');
//var EventBus = _.clone(Backbone.Events);



// ##################################################
// # Initialize Contexts
// ##################################################

var skin = getSkin();

var storeContext = {};

var appContext = require("../stores/ui.AppContext")['for']({
	stores: {
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
		orderStatus: require("../stores/ui.OrderStatus")['for'](storeContext)
	},
	skin: skin
	// TODO: Inject config
});


storeContext.appContext = appContext;


appContext.on("change:ready", function () {

console.log("appContext.get('context').dev", appContext.get('context').dev);

	if (!appContext.get('context').dev) return;

	setTimeout(function () {

//		if (appContext.get('selectedView') === 'Checkout') {

			// DEV: Init order form
			var order = appContext.get('stores').orders.getOrder(appContext.get('todayId'));
			var form = order.get("form");
			if (form) form = JSON.parse(form);


			if (!form || !form['info[name]']) {
				order.set("form", JSON.stringify({
				 	"info[name]": "Bill Smith",
				 	"info[email]": "cadorn.test@gmail.com",
				 	"info[phone]": "+17788219208",
				 	"card[name]": "Bill Smith",
				 	"card[cvc]": "123",
				 	"card[number]": "1234 1234 1234 1234",
				 	"card[expire-month]": "4",
				 	"card[expire-year]": "2018"
				}));
			}
//		}

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


appContext.set('initialized', true);


// ##################################################
// # Initialize UI and attach to DOM & Context
// ##################################################

$(function () {
	try {
		require('react').render(
			<skin.RootView appContext={appContext}/>,
			document.getElementById('GBL_DEV_Views')
		);
	} catch (err) {
		console.error("ERROR attaching react to DOM", err.stack || err.message || err);
	}
});


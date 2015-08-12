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
	if (skin === "index") {
		return require("./skin.index.js");
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

	if (!appContext.get('context').dev) return;

	setTimeout(function () {

		if (appContext.get('selectedView') === 'Checkout') {

			// DEV: Init cart
			appContext.get('stores').cart.addItem("1");

			// DEV: Init order form
			var order = appContext.get('stores').orders.getOrder(appContext.todayId);
			order.set("form", {
			 	"info[name]": "Bill Smith",
			 	"info[email]": "cadorn.test@gmail.com",
			 	"card[name]": "Bill Smith",
			 	"card[cvc]": "123",
			 	"card[number]": "1234 1234 1234 1234",
			 	"card[expire-month]": "4",
			 	"card[expire-year]": "2018"
			});
		}

		$('#form-subscribe input[type="email"]').val("cadorn.test@gmail.com");

	}, 1000);

});


appContext.redirectTo = function (contextId, viewId) {

	var url = window.location.origin + '/' + contextId + '#' + viewId;

	console.log("Redirect to", url);

	window.location.href = url;
}


appContext.set('initialized', true);


// ##################################################
// # Initialize UI and attach to DOM & Context
// ##################################################

try {

	require('react').render(
		<skin.RootView appContext={appContext}/>,
		document.getElementById('GBL_DEV_Views')
	);

} catch (err) {
	console.error("ERROR attaching react to DOM", err.stack || err.message || err);
}


var console = require("../app/lib/console");

var COMMON = require("./ui._common.model");


exports.makeContextForClient = function (overrides, API) {

	var common = COMMON.forContext(API);

	overrides = overrides || {};

	var config = {
		dev: false,
		type: "",
		sessionToken: null,
		context: {},
		initialized: false,
		ready: false,
	    selectedView: "",
	    // When navigating away from from the 'lockedView' we will do a REDIRECT instead of a PUSH-STATE
	    lockedView: "",
	    selectedDay: null,
	    selectedDayId: null,
	    todayId: common.MOMENT_CT().format("YYYY-MM-DD"),
	    today: common.MOMENT_CT().format("ddd"),
	    windowOrigin: null,
	    stores: null,
	    skin: null,
	    forceAllowOrder: false,
	    data: null,
	    testMode: false,
	    skinHelpers: null
	};

//	Object.keys(overrides).forEach(function (name) {
//		if (typeof config[name] === "undefined") {
//			throw new Error("Cannot override property '" + name + "' as it is not declared in the model!");
//		}
//	});

	COMMON.API.UNDERSCORE.extend(config, overrides || {});

	var AppContext = makeContextModel({
		props: {
			dev: "boolean",
			sessionToken: "string",
			context: "object",
			initialized: "boolean",
			ready: "boolean",
	        skin: "object",
	        stores: "object",
	        today: "string",
	        todayId: "string",
	        lockedView: "string",
	        windowOrigin: "string",
	        forceAllowOrder: "boolean",
	        data: "object",
	        testMode: "boolean",
	        skinHelpers: "object",
//		},
//	    session: {
	        selectedView: "string",
	        selectedDay: "string",
	        selectedDayId: "string"
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

	var appContext = new AppContext(config);

	appContext.MOMENT = (API && API.MOMENT) || common.MOMENT;
	appContext.MOMENT_CT = (API && API.MOMENT_CT) || common.MOMENT_CT;

	return appContext;
}

exports.makeContextForServer = function (overrides) {

	var config = {
	    windowOrigin: null
	};

	COMMON.API.UNDERSCORE.extend(config, overrides || {});

	var AppContext = makeContextModel({});

	return new AppContext(config);	
}


function makeContextModel (extraDefinition) {

	// @see http://ampersandjs.com/docs#ampersand-state
	var definition = {
		props: {
	        windowOrigin: "string"
	    }
	};

	COMMON.API.UNDERSCORE.extend(definition, extraDefinition || {});

	return COMMON.API.AMPERSAND_STATE.extend(definition);
}


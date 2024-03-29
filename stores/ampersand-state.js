
var console = require("../app/lib/console");

/*
	props: {
		sessionToken: "string"
	},
    session: {
        selectedView: "string"
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
    	}
    }
*/

var EVENTS = require("eventemitter2");
// Below only works on server while above only works in browser.
if (EVENTS.EventEmitter2) EVENTS = EVENTS.EventEmitter2;


exports.extend = function (definition) {


	var State = function (values) {
		this._definition = definition;
		this.values = values;
	}
	State.prototype = Object.create(EVENTS.prototype);
	
	State.prototype.getValues = function () {
		var self = this;
		var values = {};
		State.getFields().forEach(function (name) {
			values[name] = self.get(name);
		});
		return values;
	}

	State.prototype.get = function (name) {
		if (
			(
				definition.props &&
				typeof definition.props[name] !== "undefined"
			) ||
			(
				definition.session &&
				typeof definition.session[name] !== "undefined"
			)
		) {
			return this.values[name];
		} else if (
			definition.derived &&
			typeof definition.derived[name] !== "undefined"
		) {
			return definition.derived[name].fn.call(this.values);
		} else {
			console.error("definition", JSON.stringify(definition, null, 4));
			console.error("Property with name '" + name + "' not declared!");
			throw new Error("Property with name '" + name + "' not declared!");
		}
	}

	State.prototype.set = function (name, value) {
		if (this.values[name] === value) return;

		this.values[name] = value;

		try {
			this.emit("change:" + name);
			this.emit("change");
		} catch (err) {
console.error("Error while emitting change event for '" + name + "':", err.stack);
			throw err;			
		}
	}

	State.getFields = function () {
		return [].concat(
			(definition.props && Object.keys(definition.props)) || [],
			(definition.session && Object.keys(definition.session)) || [],
			(definition.derived && Object.keys(definition.derived)) || []
		);
	}

	State._definition = definition;

	return State;
}

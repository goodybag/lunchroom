
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

const EVENTS = require("eventemitter2");


exports.extend = function (definition) {


	var State = function (values) {
		this.values = values;
	}
	State.prototype = Object.create(EVENTS.prototype);
	
	State.prototype.getValues = function () {
		return this.values;
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

console.log("GET DERIVED!", name, this.values);

			return definition.derived[name].fn.call(this.values);

		} else {
			console.error("definition", JSON.stringify(definition, null, 4));
			console.error("Property with name '" + name + "' not declared!");
			throw new Error("Property with name '" + name + "' not declared!");
		}


console.log("STATE get name", name);
	}

	State.prototype.set = function (name, value) {
		if (this.values[name] === value) return;

console.log("STATE set name", name, value);

		this.values[name] = value;
		this.emit("change:" + name);
		this.emit("change");

	}

	State.getFields = function () {
		return [].concat(
			(definition.props && Object.keys(definition.props)) || [],
			(definition.session && Object.keys(definition.session)) || [],
			(definition.derived && Object.keys(definition.derived)) || []
		);
	}

	return State;
}
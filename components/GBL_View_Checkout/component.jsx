
var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Checkout",

	    onMount: function () {

			// We update on every change to the cart store for now.
			// TODO: Remove this once data mapped by 'mapData' below triggers change notifications.
			this.props.appContext.get('stores').cart.on("change", this._trigger_forceUpdate);
			this.props.appContext.get('stores').orders.on("change", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {

			// We update on every change to the cart store for now.
			// TODO: Remove this once data mapped by 'mapData' below triggers change notifications.
			this.props.appContext.get('stores').cart.off("change", this._trigger_forceUpdate);
			this.props.appContext.get('stores').orders.off("change", this._trigger_forceUpdate);
	    },

	    render: function() {
			return {};
	    }

	});
}

/*

saveForm: function (formSelector) {

	var values = {};
	$(':input', $(formSelector)).each(function() {
		values[this.name] = $(this).val();
	});

	order.set("form", values);
}

*/
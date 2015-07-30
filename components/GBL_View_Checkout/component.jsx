
const COMPONENT = require("../GBL_ReactComponent");

exports.for = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Checkout",

	    onMount: function () {
			this.props.appContext.stores.cart.on("update", this._trigger_forceUpdate);
			this.props.appContext.stores.orders.on("update", this._trigger_forceUpdate);
			this.props.appContext.stores.items.on("sync", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.stores.cart.off("update", this._trigger_forceUpdate);
			this.props.appContext.stores.orders.off("update", this._trigger_forceUpdate);
			this.props.appContext.stores.items.off("sync", this._trigger_forceUpdate);
	    },

	    render: function() {
	    	var self = this;

	        var cart = self.props.appContext.stores.cart;
			var order = self.props.appContext.stores.orders.getOrder(self.props.appContext.todayId);

			var events = self.props.appContext.stores.events;

	        return {

				eventToday: self.modelRecordsWithStore(events, events.getToday()).pop(),

	        	// The items in the cart
	        	items: self.modelRecordsWithStore(cart, cart.where()),

	        	order: order,

	        	saveForm: function (formSelector) {

	        		var values = {};
					$(':input', $(formSelector)).each(function() {
						values[this.name] = $(this).val();
					});

					order.set("form", values);
	        	}
	        };
	    }

	});
}

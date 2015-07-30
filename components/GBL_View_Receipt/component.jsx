
const COMPONENT = require("../GBL_ReactComponent");

exports.for = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Receipt",

	    onMount: function () {
			this.props.appContext.stores.orders.on("update", this._trigger_forceUpdate);
			this.props.appContext.stores.cart.on("update", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.stores.orders.off("update", this._trigger_forceUpdate);
			this.props.appContext.stores.cart.off("update", this._trigger_forceUpdate);
	    },

	    render: function() {
	    	var self = this;

			var order = self.props.appContext.stores.orders.getActiveOrder();

			if (!order) {
				return {
					order: null,
					items: null
				};
			}

			order = self.modelRecordsWithStore(self.props.appContext.stores.orders, [order])[0];

	        var cart = self.props.appContext.stores.cart;
	        var items = self.modelRecordsWithStore(cart, cart.where());

			var events = self.props.appContext.stores.events;

	        return {

				eventToday: self.modelRecordsWithStore(events, events.getToday()).pop(),

	        	order: order,

	        	items: items
	        };
	    }

	});
}

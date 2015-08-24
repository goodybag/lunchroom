
var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Checkout",

	    onMount: function () {
			this.props.appContext.get('stores').cart.on("update", this._trigger_forceUpdate);
			this.props.appContext.get('stores').orders.on("update", this._trigger_forceUpdate);
			this.props.appContext.get('stores').items.on("sync", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.get('stores').cart.off("update", this._trigger_forceUpdate);
			this.props.appContext.get('stores').orders.off("update", this._trigger_forceUpdate);
			this.props.appContext.get('stores').items.off("sync", this._trigger_forceUpdate);
	    },

	    render: function() {
	    	var self = this;

return {};

	        var cart = self.props.appContext.get('stores').cart;
			var order = self.props.appContext.get('stores').orders.getOrder(self.props.appContext.get('todayId'));

			var events = self.props.appContext.get('stores').events;
			var consumerGroups = self.props.appContext.get('stores').consumerGroups;

	        return {

				eventToday: self.modelRecordsWithStore(events, events.getToday()).pop(),

				lunchroom: self.modelRecordsWithStore(consumerGroups, consumerGroups.getLunchroom()).pop(),

	        	// The items in the cart
	        	items: self.modelRecordsWithStore(cart, cart.where()),

	        	order: order,

	        	summary: cart.getSummary(),

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


var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Order_Placed",

	    onMount: function () {
			this.props.appContext.get('stores').orders.on("sync", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.get('stores').orders.off("sync", this._trigger_forceUpdate);
	    },

	    render: function() {
	    	var self = this;

			var order = self.props.appContext.get('stores').orders.getActiveOrder();

			if (!order) {
				return {
					order: null
				};
			}

			order = self.modelRecordsWithStore(self.props.appContext.get('stores').orders, [order])[0];

	        return {

	        	order: order
	        };
	    }

	});
}

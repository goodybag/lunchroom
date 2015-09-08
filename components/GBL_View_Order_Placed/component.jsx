
var console = require("../../app/lib/console");


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
return {};	    	

			var events = self.props.appContext.get('stores').events;

//			var order = self.props.appContext.get('stores').orders.getOrder(self.props.appContext.get('todayId'));
			var consumerGroups = self.props.appContext.get('stores').consumerGroups;
/*
			if (!order) {
				return {
					order: null
				};
			}
*/
//			order = self.modelRecordsWithStore(self.props.appContext.get('stores').orders, [order])[0];

	        return {

				eventToday: self.modelRecordsWithStore(events, events.getToday()).pop(),

				lunchroom: self.modelRecordsWithStore(consumerGroups, consumerGroups.getLunchroom()).pop()

//	        	order: order
	        };
	    }

	});
}

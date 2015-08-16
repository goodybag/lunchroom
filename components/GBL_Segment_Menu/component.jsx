
var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		segmentName: "Menu",

	    onMount: function () {
			this.props.appContext.get('stores').cart.on("update", this._trigger_forceUpdate);
			this.props.appContext.get('stores').events.on("update", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
	    	if (this.eventsCheckInterval) {
	    		clearInterval(this.eventsCheckInterval);
	    		this.eventsCheckInterval = null;
	    	}
			this.props.appContext.get('stores').cart.off("update", this._trigger_forceUpdate);
			this.props.appContext.get('stores').events.off("update", this._trigger_forceUpdate);
	    },

	    render: function () {
	    	var self = this;

	        var days = self.props.appContext.get('stores').days;
	        var cart = self.props.appContext.get('stores').cart;
	        var events = self.props.appContext.get('stores').events;

	        var cartItemCount = 0;

	        return {

	        	// The menu grouped by 'Mon", "Tue", ...
	        	days: self.modelRecordsWithStore(days, days.where()),

	        	// The shopping cart
	        	cart: self.modelRecordsWithStore(cart, cart.where()).map(function (item) {
	        		cartItemCount += item.get("quantity");
	        		return item;
	        	}),

	        	cartItemCount: cartItemCount,

	        	eventToday: self.modelRecordsWithStore(events, events.getToday()).pop()
	        };
	    }

	});

}

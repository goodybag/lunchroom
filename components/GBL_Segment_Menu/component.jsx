
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

		afterRender: function (Context, element) {
			var self = this;

// TODO: Port
			$('.menu .item', element).tab();
			$('.menu .item', element).on('click', function () {
				var selectedDay = $(this).attr("data-tab");
				Context.appContext.set('selectedDay', selectedDay);
				Context.appContext.set('selectedView', "Menu_Web");
			});
			$('.menu .item', element).removeClass('active');
		    $('.menu .item[data-tab="' + Context.appContext.get('selectedDay') + '"]', element).addClass('active');


		    Context.ensureForNodes(
		    	$('.button[data-link]', element),
		    	'click',
		    	function () {
		    		var selectedView = $(this).attr("data-link").replace(/^#/, "");
					Context.appContext.set('selectedView', selectedView);
		    	}
		    );


		    if (Context.cartItemCount > 0) {
		    	$('.button[data-link="#Checkout"]', element).removeClass("disabled");
		    } else {
		    	$('.button[data-link="#Checkout"]', element).addClass("disabled");
		    }


// TODO: Port
		    if (
		    	Context.eventToday &&
		    	!self.eventsCheckInterval
		    ) {
		    	var lastOrderTimer = null;
		    	self.eventsCheckInterval = setInterval(function () {
					if (lastOrderTimer === null) {
						lastOrderTimer = Context.eventToday.get('format.orderTimer');
					} else
					if (Context.eventToday.get('format.orderTimer') !== lastOrderTimer) {
						lastOrderTimer = Context.eventToday.get('format.orderTimer');
						self._trigger_forceUpdate();
					}
					if (Context.eventToday.get("ordersLocked") && self.eventsCheckInterval) {
						// Once orders are locked we can stop querying.
						clearInterval(self.eventsCheckInterval);
	    				self.eventsCheckInterval = null;
					}
				}, 1 * 1000);
			}
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

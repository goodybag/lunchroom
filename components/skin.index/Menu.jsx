
const COMPONENT = require("../GBL_ReactComponent");

exports.for = function (Context) {

	var Tag = COMPONENT.create(Context, {

	    displayName: 'Menu',

	    onMount: function () {
			this.props.appContext.stores.cart.on("update", this._trigger_forceUpdate);
			this.props.appContext.stores.events.on("update", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
	    	if (this.eventsCheckInterval) {
	    		clearInterval(this.eventsCheckInterval);
	    		this.eventsCheckInterval = null;
	    	}
			this.props.appContext.stores.cart.off("update", this._trigger_forceUpdate);
			this.props.appContext.stores.events.off("update", this._trigger_forceUpdate);
	    },

		afterRender: function (Context, element) {
			var self = this;

			$('.menu .item', element).tab();
			$('.menu .item', element).on('click', function () {
				var selectedDay = $(this).attr("data-tab");
				Context.appContext.selectedDay = selectedDay;
				Context.appContext.selectedView = "Menu_Web";
			});
			$('.menu .item', element).removeClass('active');
		    $('.menu .item[data-tab="' + Context.appContext.selectedDay + '"]', element).addClass('active');

		    Context.ensureForNodes(
		    	$('.button[data-link]', element),
		    	'click',
		    	function () {
		    		var selectedView = $(this).attr("data-link").replace(/^#/, "");
					Context.appContext.selectedView = selectedView;
		    	}
		    );

		    if (Context.cartItemCount > 0) {
		    	$('.button[data-link="#Checkout"]', element).removeClass("disabled");
		    } else {
		    	$('.button[data-link="#Checkout"]', element).addClass("disabled");
		    }

		    if (!self.eventsCheckInterval) {
		    	var lastOrderTimer = null;
		    	self.eventsCheckInterval = setInterval(function () {
					if (lastOrderTimer === null) {
						lastOrderTimer = Context.eventToday['format.orderTimer'];
					} else
					if (Context.eventToday['format.orderTimer'] !== lastOrderTimer) {
						lastOrderTimer = Context.eventToday['format.orderTimer'];
						self._trigger_forceUpdate();
					}
					if (Context.eventToday.ordersLocked && self.eventsCheckInterval) {
						// Once orders are locked we can stop querying.
						clearInterval(self.eventsCheckInterval);
	    				self.eventsCheckInterval = null;
					}
				}, 1 * 1000);
			}
		},

	    render: function () {
	    	var self = this;

	        var days = self.props.appContext.stores.days;
	        var cart = self.props.appContext.stores.cart;
	        var events = self.props.appContext.stores.events;

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
	    },

	    getHTML: function (Context) {

			var DaysTabs = "";

			var SneakPeak = "";
			if (Context.appContext.selectedDay !== Context.appContext.today) {
				SneakPeak = (
					<div>
						Sneak Peak! (You can look but not order)
					</div>
				);
			}

			DaysTabs = (
			    <div className="seven wide column">
					<div className="ui top attached tabular menu">
						{Context.days.map(function (item) {
				        	return <div key={item.id} className="item" data-tab={item.get("format.ddd")}>{item.get("format.ddd")}</div>;
						})}		
					</div>
					{SneakPeak}
			    </div>
			);

			var DeliveryTime = "";
			var TimeLeft = "";
			var CompanyHeading = "";
			if (Context.eventToday) {
				DeliveryTime = (
				    <div className="three wide column">
				    	Delivery Time:<br/>
				    	<b>{Context.eventToday.get("format.deliveryTime")}</b>
				    </div>
				);
				if (Context.eventToday.get("format.orderTimer")) {
					TimeLeft = (
						<div className="three wide column">
					    	Time left to order:<br/>
					    	<b>{Context.eventToday.get("format.orderTimer")}</b>
					    </div>
					);
				}
				CompanyHeading = (
					<div className="six wide column">
						<div className="ui basic segment">
						  For company: <b>{Context.eventToday.get("consumerGroup.title")}</b>
						</div>
					</div>
				);
				if (Context.appContext.selectedView === "Menu_Web") {
					CompanyHeading = [
						{CompanyHeading},
						(
							<div className="ten wide column">

							</div>
						)
					];
				}
			}

			return (
				<div id="page-menu" className="five column row">

					{DaysTabs}
				    
				    {DeliveryTime}
				    {TimeLeft}
				    <div className="three wide right aligned column">
						<div data-link="#Checkout" className="ui primary button">
						  Checkout ({Context.cartItemCount})
						</div>
				    </div>

				    {CompanyHeading}

			    </div>
			);
	    }
	});

	const React = COMPONENT.API.REACT;
	return (
		<Tag appContext={Context.appContext}/>
	);
}

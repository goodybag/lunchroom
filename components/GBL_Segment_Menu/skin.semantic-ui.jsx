
require("./component.jsx")['for'](module, {


	afterRender: function (Context, element) {
		var self = this;


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


	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		var DaysTabs = "";

// TODO: Port
		var SneakPeak = "";
		if (Context.appContext.get('selectedDay') !== Context.appContext.get('today')) {
			SneakPeak = (
				<div>
					Sneak Peak! (You can look but not order)
				</div>
			);
		}

		if (Context.days) {
			DaysTabs = (
			    <div className="seven wide column">
					<div className="ui top attached tabular menu">
						{Context.days.map(function (item) {
				        	return <div key={item.get('id')} className="item" data-tab={item.get("format.ddd")}>{item.get("format.ddd")}</div>;
						})}		
					</div>
					{SneakPeak}
			    </div>
			);
		}

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
			if (Context.appContext.get('selectedView') === "Menu_Web") {
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

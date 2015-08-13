
require("./component.jsx")['for'](module, {
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

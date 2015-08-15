
require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {

		return {
			"orderPlaced": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckoutSuccess/order-success.cjs.jsx"),
				markup: function (element) {

				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"pickupTime": Context.eventToday.get("format.deliveryTime"),
						"deliveryLocation": Context.eventToday.get("consumerGroup.pickupLocation")
					});

					this.fillElements(element, {
						"shareUrl": Context.lunchroom.get("lunchroomUrl")
					});
				}
			})
		};
	},

	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		return (
        	<div>

	        	{Context.components.Header}

				<Context.templates.orderPlaced.comp />

	        	{Context.components.Footer}

	        </div>
		);
	}
});


require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {

		return {
			"orderPlaced": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/order-success.cjs.jsx"),
				markup: function (element) {

				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"pickupTime": Context.eventToday.get("format.deliveryTime")
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

console.log("Context.components.Header", Context.components.Header);


		return (
        	<div>

	        	{Context.components.Header}

	        	{Context.components.Menu}

				<Context.templates.orderPlaced.comp />

	        	{Context.components.Footer}

	        </div>
		);
	}
});


var console = require("../../app/lib/console");


require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {

		return {
			"order_placed": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckoutSuccess/order-success.cjs.jsx"),
				markup: function (element) {

				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"pickupTime": Context.eventToday.get("format.deliveryTime"),
						"deliveryLocation": Context.eventToday.get("consumerGroup.pickupLocation")
					});
				}
			}),
			"share_menu_link": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckoutSuccess/share-menu-link.cjs.jsx"),
				markup: function (element) {

				},
				fill: function (element, data, Context) {

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
        	<div className="page page-order-submitted">

	        	{Context.components.Header}

				<Context.templates.order_placed.comp />
				<Context.templates.share_menu_link.comp />

	        	{Context.components.Footer}

	        </div>
		);
	}
});


require("./component.jsx")['for'](module, {

	getTemplateData: function (Context) {

		var data = {};

		if (Context.eventToday) {
			data['deliveryTime'] = Context.eventToday.get("format.deliveryTime");
			data['timeLeftToOrder'] = Context.eventToday.get("format.orderTimer") || "Too late for today!";
			data['deliverTo'] = Context.eventToday.get("consumerGroup.title");
			data['cartItemCount'] = Context.cartItemCount;
		}

		data["tabs"] = Context.days.map(function (item) {
			return {
				"id": item.get('id'),
				"tabDay": item.get("format.ddd"),
				"tabDate": item.get("format.MMM-D")
			};
		});

		return data;
	},

	getTemplate: function (Context) {

		return new Context.Template({
			impl: require("../../www/lunchroom-landing~0/components/AppMenu/navbar.cjs.jsx"),
			markup: function (element) {
				var self = this;

				self.liftSections(element);

				$('[data-component-elm="checkoutButton"]', element).click(function () {
				    if (Context.appContext.get('stores').cart.getItemCount() > 0) {
						Context.appContext.set('selectedView', "Checkout");
					}
					return false;
				});

				if (Context.appContext.get('selectedView') !== "Checkout") {
					self.showViews(element, [
						"not-on-checkout"
					]);
				} else {
					self.showViews(element, []);						
				}
			},
			fill: function (element, data, Context) {
				var self = this;

				self.fillProperties(element, data);

				// TODO: Verify
			    if (data.cartItemCount > 0) {
			    	$('[data-component-elm="checkoutButton"]', element).removeClass("disabled");
			    } else {
			    	$('[data-component-elm="checkoutButton"]', element).addClass("disabled");
			    }

			    self.renderSection("tabs", data.tabs, function getView (data) {
					if (
						Context.appContext.get('selectedDay') === data.tabDay
					) {
						return 'active';
					} else {
						return 'default';
					}
			    }, function hookEvents(elm, data) {
					elm.on("click", function () {
						Context.appContext.set('selectedDay', data.tabDay);
						Context.appContext.set('selectedView', "Menu_Web");
						return false;
					});
			    });
			}
		});
	}
});


require("./component.jsx")['for'](module, {

	getTemplateData: function (Context) {

		var data = {};

		var event = Context.appContext.get('stores').events.getModeledForDay(Context.appContext.get('selectedDayId'));
		if (event.length > 0) {
			if (event.length > 1) {
				throw new Error("Only one event should be found!");
			}
			event = event[0];
			data['deliveryTime'] = event.get("format.deliveryTime");
			data['timeLeftToOrder'] = event.get("format.orderTimer") || "Too late for today!";
			data['secondsLeftToOrder'] = parseInt(event.get("format.orderTimerSeconds") || 0);
			data['deliverTo'] = event.get("consumerGroup.title");
			data['cartItemCount'] = Context.cartItemCount;
			data['day_id'] = event.get("day_id");
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
						Context.appContext.set('selectedDayId', data.id);
						Context.appContext.set('selectedDay', data.tabDay);
						Context.appContext.set('selectedView', "Menu_Web");
						return false;
					});
			    });

			    if (data['day_id']) {
			    	var views = [
				    	"menuAvailable"
			    	];
			    	if (
			    		data['day_id'] === Context.appContext.get('todayId')
			    	) {
			    		views.push("orderCountdown");
						if (
							Context.appContext.get('selectedView') !== "Checkout" &&
			    			data['secondsLeftToOrder'] > 0
			    		) {
							views.push("not-on-checkout");
						}
			    	}
					self.showViews(element, views);
			    } else {
					self.showViews(element, []);
			    }

			    if (
			    	data['secondsLeftToOrder'] > 0 &&
			    	data['secondsLeftToOrder'] < 60 * 60
			    ) {
					var clock = $('[data-component-prop="timeLeftToOrder"]', element).FlipClock({
						clockFace: 'MinuteCounter'
					});
					clock.setTime(data['secondsLeftToOrder']);
					clock.setCountdown(true);
					clock.start();
				}
			}
		});
	}
});

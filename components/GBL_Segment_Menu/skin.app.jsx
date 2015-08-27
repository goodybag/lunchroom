
var console = require("../../app/lib/console");


function startTimer (duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.html(minutes + ":" + seconds);

        if (diff <= 0) {
        	clearInterval(startTimer.previousInterval);
        	startTimer.previousInterval = null;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    if (startTimer.previousInterval) {
    	clearInterval(startTimer.previousInterval);
    	startTimer.previousInterval = null;
    }
    startTimer.previousInterval = setInterval(timer, 1000);
}


require("./component.jsx")['for'](module, {


	singleton: function (Context) {

		function monitorOrderDeadline () {

			var today = Context.appContext.get('stores').events.getToday();
			if (today && today.length === 1) {
				today = today[0];
			} else {
				today = null;
			}

			var ordersLocked = null;
			var interval = setInterval(function () {
				try {
					if (!today) return;
					if (ordersLocked === null) {
						ordersLocked = today.get("ordersLocked");
					} else
					if (today.get("ordersLocked") !== ordersLocked) {
						ordersLocked = today.get("ordersLocked");
						// Status has changed so we reload to lock the UI.
						console.log("Lock event due to ordersLocked");
						Context.appContext.get('stores').events.reloadAllLoaded().then(function () {

							return Context.appContext.get('stores').cart.removeAllItemsForEvent(today.get("id"));

						}).fail(function (err) {
							console.error("Error loading event or clearing cart for todays event", err.stack);
						});
					}
					if (ordersLocked && interval) {
						clearInterval(interval);
						interval = null;
					}
				} catch (err) {
					console.error("Error monitoring order deadline:", err.stack);
				}
			}, 5 * 1000);
		}

		monitorOrderDeadline();
	},


	mapData: function (Context, data) {
		return {
			'canOrder': data.connect("page/loaded/selectedEvent/canOrder"),
			'isPastDeadline': data.connect("page/loaded/selectedEvent/isPastDeadline"),
			'deliveryTime': data.connect("page/loaded/selectedEvent/format.deliveryTime"),
			'timeLeftToOrder': data.connect("page/loaded/selectedEvent/format.orderTimer", {
				ifNot: "Too late for today!"
			}),
			'secondsLeftToOrder': data.connect("page/loaded/selectedEvent/format.orderTimerSeconds", {
				ifNot: 0
			}),
			'deliverTo': data.connect("page/loaded/selectedEvent/consumer_group_id/deliverLocation"),
			'cartItemCount': data.connect("cart/itemCount()"),
			'day_id': data.connect("page/loaded/selectedEvent/day_id"),
			'tabs': data.connect("days/*", function (data) {
				return {
					"id": data.connect("id"),
					"tabDay": data.connect("format.ddd"),
					"tabDate": data.connect("format.MMM-D")
				};
			})
		};
	},

	getTemplate: function (Context) {

		return new Context.Template({
			impl: require("../../www/lunchroom-landing~0/components/AppMenu/navbar.cjs.jsx"),
			markup: function (element, data) {
				var self = this;

				self.liftSections(element);

				$('[data-component-elm="checkoutButton"]', element).click(function () {

				    if (data.cartItemCount > 0) {
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

			    self.renderSection(element, "tabs", data.tabs, function getView (data) {
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


			    var views = [];
			    var onCheckoutPage = (Context.appContext.get('selectedView') === "Checkout");

			    if (
			    	data.cartItemCount > 0 &&
			    	!onCheckoutPage
			    ) {
			    	views.push("offer-checkout");
			    }
			    if (data['day_id']) {
			    	views.push("menuAvailable");

			    	if (data['day_id'] === Context.appContext.get('todayId')) {
			    		views.push("orderCountdown");
			    	}

			    	if (
			    		data.canOrder &&
			    		!data.isPastDeadline &&
			    		!onCheckoutPage
			    	) {
				    	views.push("offer-checkout");
			    	}
			    }

				self.showViews(element, views);

			    if (
			    	data['secondsLeftToOrder'] > 0 &&
			    	data['secondsLeftToOrder'] < 60 * 60
			    ) {
				    startTimer(data['secondsLeftToOrder'], $('[data-component-prop="timeLeftToOrder"]', element));
				}
			}
		});
	}
});

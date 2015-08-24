


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


	mapData: function (data) {
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

			    if (data.cartItemCount > 0) {
			    	views.push("offer-checkout");
			    }
			    if (data['day_id']) {
			    	views.push("menuAvailable");

			    	if (data['day_id'] === Context.appContext.get('todayId')) {
			    		views.push("orderCountdown");
			    	}

			    	if (
			    		data.canOrder &&
			    		!data.isPastDeadline
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

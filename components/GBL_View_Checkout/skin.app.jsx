
var console = require("../../app/lib/console");

require("./component.jsx")['for'](module, {


	// TODO: Move into docs at: https://github.com/LogicCores/0-singleton
	// Called ONCE per page load.
	// There is NO data available for this component yet and it is NOT yet attatched to DOM.
	// Intended to initiate the loading of all resources the component needs.
	singleton: function (Context) {

		// @see https://stripe.com/docs/stripe.js
		head.load("https://js.stripe.com/v2/");
	},


	// TODO: Move into docs at: https://github.com/LogicCores/0-component
	// Called ONCE per component instanciation.
	// We can attach methods to 'Context' that will be available to all calls below.
	// This runs BEFORE the component is mounted to the DOM.
	component: function (Context, data) {

		Context.saveForm = function () {

			Context.startedEditing = true;

        	var values = {};
			$(':input[data-component-elm]', Context.componentElement).each(function() {
				values[$(this).attr("data-component-elm")] = $(this).val();
			});
			data.order.set("form", JSON.stringify(values));
			return values;
		}

		Context.placeOrder = function () {

			// NOTE: We deal with user input validation and Stripe in the component here
			//       and then hand things off to the order record to send the completed
			//       and validated order to the server.

			var form = Context.saveForm();

console.log("PLACE ORDER", form);

			// Setup validator which we use to show any errors.
			var orderInfoElm = $('.checkout-info', Context.componentElement);
			$('[name="will_add_new_card"]', orderInfoElm).prop('checked', true);
			var checkoutValidator = validators.createCheckoutValidator(orderInfoElm);
			function showError (error) {
// TODO: Don't highlight card field by default?
//       We need to set field right now or message does not show up.
				error.field = error.field || 'card_number';
				checkoutValidator.displayError(error);
				window.scrollTo(0, 0);
			}

			function validateOrder (order) {

				return Context.Q.fcall(function () {

					checkoutValidator.validate();
					if (checkoutValidator.getErrors().length > 0) {
						window.scrollTo(0, 0);
						return false;
					}

					if (!Stripe.card.validateCardNumber(form["card[number]"])) {
						showError({
							field: "card_number",
							message: "Card number format not valid!"
						});
						throw new Error("Card number format not valid!");
					}
					if (!Stripe.card.validateExpiry(form["card[expire-month]"], form["card[expire-year]"])) {
						showError({
							field: "card_expiration_year",
// TODO: Add second field to highlight
//										field: "card_expiration_month",
							message: "Card expiry format not valid!"
						});
						throw new Error("Card expiry format not valid!");
					}
					if (!Stripe.card.validateCVC(form["card[cvc]"])) {
						showError({
							field: "card_cvv",
							message: "Card CVC not valid!"
						});
						throw new Error("Card CVC not valid!");
					}

					return true;
				}).fail(function (err) {
					console.error("Error validating order:", err.message);
					return false;
				});
			}

			function authorizeCard (order) {
				return Context.Q.denodeify(function (callback) {
					try {

						console.log("Authorize card", form["card[name]"]);

						if (form["card[number]"] === "4242424242424242") {
							Stripe.setPublishableKey(
								Context.appContext.get('context').stripePublishableKey_TEST
							);
						} else {
							Stripe.setPublishableKey(
								Context.appContext.get('context').stripePublishableKey
							);
						}

						Stripe.card.createToken({
							number: form["card[number]"],
							cvc: form["card[cvc]"],
							exp_month: form["card[expire-month]"],
							exp_year: form["card[expire-year]"],
							name: form["card[name]"]
						}, function (status, response) {
							if (status !== 200) {
								return callback(new Error("Got status '" + status + "' while calling 'stripe.com'"));
							}
							if (response.error) {
								return callback(new Error(response.error.message));
							}
							return callback(null, response);
						});
					} catch (err) {
						return callback(err);
					}
				})().fail(function (err) {
					console.error("Error charging card:", err.message);
					throw err;
				});
			}

			function submitOrder (order, paymentToken) {
				return order.submit(paymentToken).fail(function (err) {
					console.error("Error submitting order:", err.message);
					throw err;
				});
			}

			function redirect (order) {
				try {

					Context.appContext.set("selectedView", "Order_Placed");

					return Context.Q.resolve();
				} catch (err) {
					console.error("Error redirecting after order:", err.message);
					return Context.Q.reject(err);
				}

				//return Context.appContext.redirectTo(
				//	"order-" + order.get("orderHashId") + "/placed"
				//);
			}

			Context.Q.fcall(function () {
				return validateOrder(data.order).then(function (valid) {

					if (!valid) {
						// User must fix form.
						return;
					}

					return authorizeCard(data.order).then(function (paymentToken) {

						console.log("Authorized card", paymentToken);

						return submitOrder(data.order, paymentToken).then(function () {

							console.log("Orders placed. Clearing cart.");

							return Context.appContext.get('stores').cart.clearAllItems().then(function () {

								return redirect(data.order);
							});
						});
					});
				});
			}).fail(function (err) {

				console.error("Error submitting order:", err.message);

				showError({
					message: err.message
				});
			});
		}
	},


	// TODO: Move into docs at: https://github.com/LogicCores/0-data
	// Called ONCE per component instanciation (which may contain more than one template).
	// Here you map data from collections and records to local properties that can be used
	// with minimal further manipulation in the templates.
	// All summary states should be computed here so that templates can simply react
	// to immutable data.
	// If ANY of the data changes in the connected collections or records, change notifications
	// are debounced and then ONE event is triggered to re-get the data and posprocess it
	// for all properties as mapped below. i.e. Individual field updates will trigger
	// the entire data structure to be re-constructed. This is efficient enough as all method
	// calls involve local cached data and we are dealing with data that changes at a LOW frequency.
	// The component (and all its templates) are only re-rendered if the final data structure
	// has changed from the previous iteration.
	// If you have high-frequency data changes (> 1 every 500 ms) that need to be rendered
	// you should be setting up dedicated components that act at a lower level than
	// this component architecture that uses a virtual dom diffing layer.
	mapData: function (Context, data) {

		var LODASH = require("lodash");

		return {
			"@map": {
				'orderByForToday': data.connect("page/loaded/todaysEvent/format.orderByTime"),				
				'order': data.connect("orders/getPending()"),
				'summary': data.connect("cart/getSummary()"),
				'items': data.connect("cart/*", function (data) {
					return {
						"id": data.connect("id"),
						"quantity": data.connect("quantity"),
						"title": data.connect("item_id/title"),
						"photo": data.connect("item_id/photo_url"),
						"priceRaw": data.connect("item_id/price"),
						"price": data.connect("item_id/format.price"),
						"day_id": data.connect("event_id/day_id"),
						"canOrder": data.connect("event_id/canOrder"),
						"isPastDeadline": data.connect("event_id/isPastDeadline"),
						"goodybagFee": data.connect("event_id/goodybagFee")
					};
				})
			},
			"@postprocess": function (data) {

				// We go through the items, group them into days and sort them
				// and get other summary info to drive templates.

				var itemsByDays = {};
				data.onlyItemsForTodayAndTooLate = false;
				if (data.items) {
					data.items.forEach(function (item) {
						if (!itemsByDays[item.day_id]) {
							itemsByDays[item.day_id] = {
								dayLabel: Context.MOMENT(item.day_id, "YYYY-MM-DD").format("dddd") + "'s",
								goodybagFee: Context.NUMERAL(item.goodybagFee/100).format('$0.00'),
								day_id: item.day_id,
								canOrder: item.canOrder,
								isPastDeadline: item.isPastDeadline,
								items: []
							};
						}
						item.amount = Context.NUMERAL(item.priceRaw * item.quantity / 100).format('$0.00');
						itemsByDays[item.day_id].items.push(item);
						if (item.day_id === Context.appContext.get('todayId')) {
							itemsByDays[item.day_id].dayLabel = "Today's";
							if (
								item.canOrder &&
								item.isPastDeadline
							) {
								data.onlyItemsForTodayAndTooLate = true;
							}
						} else {
							data.onlyItemsForTodayAndTooLate = false;
						}
					});
				}
				data.itemsByDays = Object.keys(itemsByDays).map(function (day_id) {
					LODASH.sortBy(itemsByDays[day_id].items, 'price');
					return itemsByDays[day_id];
				});
				LODASH.sortBy(data.itemsByDays, 'day_id');

				data.noItems = (data.itemsByDays.length === 0);

				try {
					data.orderForm = JSON.parse(data.order.get("form") || "{}");
				} catch (err) {
					console.warn("Could not unserialize 'form':", err.stack);
				}

				return data;
			}
		};
	},


	// TODO: Move into docs at: https://github.com/LogicCores/0-template
	// The templates involved in rendering this component.
	// Data provided in template methods comes from 'mapData' above.
	// This method is only called ONCE per component instanciation to instanciate
	// the templates, the 'markup' method is called once per template after the DOM
	// for the template has loaded and the 'fill' method is called whenever
	// 'mapData' above generates a new changed data structure.
	getTemplates: function (Context) {

		var copyName = {};

		return {			
			"too_late": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/too-late.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"orderBy": data.orderByForToday
					});
				}
			}),
			"no_items": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/no-items.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="addItemsLink"]', element).click(function () {
						Context.appContext.set('selectedView', "Menu_Web");
						return false;
					});
				},
				fill: function (element, data, Context) {
				}
			}),
			"navbar": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-navbar.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="addItemsLink"]', element).click(function () {
						Context.appContext.set('selectedView', "Menu_Web");
						return false;
					});
				},
				fill: function (element, data, Context) {
				}
			}),
			"form": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-form-new.cjs.jsx"),
				markup: function (element, data) {

					this.liftSections(element);


				    // Save form on change to any field after 250 ms debounce.
			    	$('input', element).on('keyup', Context.UNDERSCORE.debounce(function () {
	    	        	Context.saveForm();
	    	        }, 250));


			    	// Copy name to name on card
			    	$('[data-component-elm="info[name]"]', element).on('keyup', function () {
			    		var newValue = $(this).val();
			    		var existingValue = $('[data-component-elm="card[name]"]', element).val();
			    		if (
			    			newValue === existingValue ||
			    			// 'card[name]' was changed so we should no longer sync it.
			    			(
			    				copyName.lastValue &&
				    			existingValue !== copyName.lastValue
				    		)
			    		) {
			    			return;
			    		}
			    		copyName.lastValue = newValue;
						$('[data-component-elm="card[name]"]', element).val(copyName.lastValue);
				    });

				},
				fill: function (element, data, Context) {

					if (!Context.startedEditing) {
						this.fillProperties(element, data.orderForm);
						this.fillElements(element, data.orderForm);
					} else {
console.log("SKIP UPDATING FROM AS WE STARTED EDITING");

					}

					this.showViews(element, [
						"default"
					]);

// TODO: Enable this once phone number validation works.
//					window.attachSkinApp();
				}
			}),
			"items": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-items.cjs.jsx"),
				markup: function (element) {

					this.liftSections(element);

					$('[data-component-elm="addItemsLink"]', element).click(function () {
						Context.appContext.set('selectedView', "Menu_Web");
						return false;
					});
				},
				fill: function (element, checkoutData, Context) {
					var self = this;

					self.renderSection(element, "days", checkoutData.itemsByDays, function getView (dayData) {
						if (
							!dayData.canOrder ||
							dayData.isPastDeadline
						) {
							return 'too-late';
						}
						return 'default';
				    }, function hookEvents(dayElement, dayData) {

						$('[data-component-elm="addItemsLink"]', dayElement).click(function () {

							Context.appContext.set('selectedDayId', dayData.day_id);
							Context.appContext.set('selectedDay', Context.MOMENT(dayData.day_id, "YYYY-MM-DD").format("ddd"));
							Context.appContext.set('selectedView', "Menu_Web");

							return false;
						});

						self.renderSection(dayElement, "items", dayData.items, function getView (data) {
							return 'default';
					    }, function hookEvents (elm, data) {

							$('[data-component-elm="removeLink"]', elm).click(function () {
					    		Context.appContext.get('stores').cart.removeItemForEvent(dayData.event_id, data.id);
								return false;
							});
					    });
				    });
				}
			}),
			"summary": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-summary.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="placeOrderButton"]', element).click(function () {
						Context.placeOrder();
						return false;
					});

					if (Context.appContext.get('testMode')) {
						var elm = $('[data-component-elm="placeOrderButton"]', element).clone();
						elm.html("Show: Order Placed");
						elm.attr("data-component-elm", "");
						elm.appendTo($('[data-component-elm="placeOrderButton"]', element).parent());
						elm.click(function () {
							Context.appContext.set("selectedView", "Order_Placed");
						});
					}
				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"subtotal": data.summary["format.amount"],
						"taxRate": data.summary["format.tax"],
						"taxAmount": data.summary["format.taxAmount"],
						"goodybagFee": data.summary["format.goodybagFee"],
						"total": data.summary["format.total"]
					});
				}
			})
		};
	},


	// TODO: Move into docs at: https://github.com/LogicCores/0-component
	// This method is called EVERY TIME the component updates with new data.
	// It serves to layout the templates supplied with 'getTemplates' for the component.
	// You can bypass using templates completely and just generate HTML code here
	// that will get diffed and chanegs applied to DOM.
	// If a template is used, the 'markup' method of the template will fire
	// after the template has been redered to the DOM the FIRST time. The 'fill' method
	// of the template will fire every time the data changes. i.e. If this method
	// always returns the same HTML, the entire diffing step is skipped and the only
	// thing that is called for every new 'data' structure is the 'fill' method in
	// the templates.
	// TODO: Add optimization to instruct component that HTML layout only needs to
	//       be fetched once. This can be done if all data-based view manipulation
	//       happens in templates and NOT below. i.e. only if below will always
	//       generate EXACT SAME HTML.
	getHTML: function (Context, data) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		var Panel = null;

		if (data.noItems) {

			Panel = (
				<Context.templates.no_items.comp />
			);

		} else
		if (data.onlyItemsForTodayAndTooLate) {

			Panel = (
				<Context.templates.too_late.comp />
			);

		} else {

			Panel = [
				<Context.templates.navbar.comp />,
				<Context.templates.form.comp />,
				<Context.templates.items.comp />,
				<Context.templates.summary.comp />
			];
	    }

		return (
        	<div className="page page-checkout">

	        	{Context.components.Header}

	        	{Context.components.Menu}

	        	{Panel}

	        	{Context.components.Footer}

	        </div>
		);
	},


	// TODO: Move into docs at: https://github.com/LogicCores/0-component
	// This runs after every time the component is re-rendered/updated to the DOM.
	unveil: function (Context, data) {

		// In test mode we pre-fill the form.
		if (Context.appContext.get('testMode')) {

			var form = data.order.get("form");
			if (form) {
				form = JSON.parse(form);
			}

			if (!form || !form["info[name]"]) {
				data.order.set("form", JSON.stringify({
				 	"info[name]": "Bill Smith",
				 	"info[email]": "cadorn.test@gmail.com",
				 	"info[phone]": "",
				 	"card[name]": "Bill Smith",
				 	"card[cvc]": "123",
				 	"card[number]": "4242424242424242",
				 	"card[expire-month]": "12",
				 	"card[expire-year]": "2016"
				}));
			}
		}
	}

});

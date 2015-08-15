
require("./component.jsx")['for'](module, {

	singleton: function (Context) {

		// @see https://stripe.com/docs/stripe.js
		head.load("https://js.stripe.com/v2/", function() {
			
			Stripe.setPublishableKey(
				Context.appContext.get('context').stripePublishableKey
			);
		});

	},

	getTemplates: function (Context) {

		var copyName = {};

		return {
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
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-form.cjs.jsx"),
				markup: function (element) {

				    // Save form on change to any order field.
			    	$('input', element).on('keyup', function () {
						var values = {};
						$(':input[data-component-elm]', element).each(function() {
							values[$(this).attr("data-component-elm")] = $(this).val();
						});
						Context.order.set("form", JSON.stringify(values));
					});

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
			    	var values = Context.order.get("form");
			    	if (values) {
			    		values = JSON.parse(values);

						this.fillProperties(element, values);
						this.fillElements(element, values);
					}
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
				fill: function (element, data, Context) {

					var items = Context.items.map(function(item) {
						return {
							"id": item.get('id'),
							"title": item.get("title"),
							"photo": item.get("photo_url"),
							"quantity": item.get("quantity"),
							"price": item.get("format.price"),
							"amount": item.get("format.amount")
						};
					});

					this.renderSection("items", items, function getView (data) {
						return 'default';
				    }, function hookEvents(elm, data) {

						$('[data-component-elm="removeLink"]', elm).click(function () {

				    		Context.appContext.get('stores').cart.remove(data.id);
							return false;
						});

				    });
				}
			}),
			"summary": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-summary.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="placeOrderButton"]', element).click(function () {

						function validateOrder (order) {
							return Context.Q.fcall(function () {

								var form = JSON.parse(order.get("form"));

								if (!Stripe.card.validateCardNumber(form["card[number]"])) {
									throw new Error("Card number format not valid!");
								}
								if (!Stripe.card.validateExpiry(form["card[expire-month]"], form["card[expire-year]"])) {
									throw new Error("Card expiry not valid!");
								}
								if (!Stripe.card.validateCVC(form["card[cvc]"])) {
									throw new Error("Card CVC not valid!");
								}

							}).fail(function (err) {
								console.error("Error validating order:", err.message);
								throw err;
							});
						}

						function prepareOrder (order) {
							return order.submit().fail(function (err) {
								console.error("Error preparing order:", err.message);
								throw err;
							});
						}

						function chargeCard (order) {
							return Context.Q.denodeify(function (callback) {
								try {
									var form = JSON.parse(order.get("form"));
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

						function finalizeOrder (order, paymentConfirmation) {
							return order.addPaymentConfirmation(paymentConfirmation).then(function () {

								return Context.appContext.get('stores').cart.clearAllItems();

							}).fail(function (err) {
								console.error("Error finalizing order:", err.message);
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
							return validateOrder(Context.order).then(function () {
								return prepareOrder(Context.order).then(function (order) {
									return chargeCard(order).then(function (paymentConfirmation) {
										return finalizeOrder(order, paymentConfirmation);
									}).then(function () {
										return redirect(order);
									});
								});
							});
						}).fail(function (err) {
// TODO: Show error message
							console.error("Error submitting order:", err.message);
							alert("ERROR: " + err.message);
						});

						return false;
					});

				},
				fill: function (element, data, Context) {

					var values = {
						"subtotal": Context.summary["format.amount"],
						"taxRate": Context.summary["format.tax"],
						"taxAmount": Context.summary["format.taxAmount"],
						"goodybagFee": Context.summary["format.goodybagFee"],
						"total": Context.summary["format.total"]
					};

					this.fillProperties(element, values);
				}
			})
		};
	},


	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		var Panel = null;

		if (!Context.eventToday) {

			Panel = (
				<div className="sixteen wide column">
					<div className="ui message">
					  <div className="header">
					    No active event!
					  </div>
					</div>
				</div>
			);

		} else
		if (Context.items.length === 0) {

			Panel = (
				<div className="sixteen wide column">
					<div className="ui message">
					  <div className="header">
					    Grab something <a href="#Menu_Web">here</a>
					  </div>
					  <p>You are going to go hungry because there is nothing in your cart!</p>
					</div>
				</div>
			);

		} else {

			Panel = [
				<Context.templates.navbar.comp />,
				<Context.templates.form.comp />,
				<Context.templates.items.comp />,
				<Context.templates.summary.comp />,
			];
	    }

		return (
        	<div>

	        	{Context.components.Header}

	        	{Context.components.Menu}

	        	{Panel}

	        	{Context.components.Footer}

	        </div>
		);
	}
});


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
			"too_late": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/too-late.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"orderBy": Context.eventToday.get('format.orderByTime')
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
				markup: function (element) {

					this.liftSections(element);

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
				    		Context.appContext.get('stores').cart.removeItem(data.id);
							return false;
						});

				    });
				}
			}),
			"summary": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppCheckout/checkout-summary.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="placeOrderButton"]', element).click(function () {

						var orderInfoElm = $('.checkout-info');
						$('[name="will_add_new_card"]', orderInfoElm).prop('checked', true);
						var checkoutValidator = validators.createCheckoutValidator(orderInfoElm);
						function showError (error) {
// TODO: Don't highlight card field by default?
//       We need to set field right now or message does not show up.
							error.field = error.field || 'card_number';
							checkoutValidator.displayError(error);
						}

						function validateOrder (order) {

							return Context.Q.fcall(function () {

								checkoutValidator.validate();
								if (checkoutValidator.getErrors().length > 0) {
									window.scrollTo(0, 0);
									return false;
								}

								var form = JSON.parse(order.get("form"));

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

						function finalizeOrder (order, paymentToken) {
							return order.addPaymentToken(paymentToken).then(function () {

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
							return validateOrder(Context.order).then(function (valid) {

								if (!valid) {
									// User must fix form.
									return;
								}

								return prepareOrder(Context.order).then(function (order) {
									return chargeCard(order).then(function (paymentToken) {
										return finalizeOrder(order, paymentToken);
									}).then(function () {
										return redirect(order);
									});
								});
							});
						}).fail(function (err) {

							console.error("Error submitting order:", err.message);

							showError({
								message: err.message
							});
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

		if (
			!Context.appContext.get("forceAllowOrder") &&
			parseInt(Context.eventToday.get("format.orderTimerSeconds") || 0) <= 0
		) {

			Panel = (
				<Context.templates.too_late.comp />
			);

		} else
		if (
			!Context.eventToday ||
			Context.items.length === 0
		) {

			Panel = (
				<Context.templates.no_items.comp />
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
	}
});

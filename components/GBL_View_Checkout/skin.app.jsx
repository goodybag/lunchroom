
require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {

		var copyName = {};

		return {
			"form": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/checkout-form.cjs.jsx"),
				markup: function (element) {

				    // Save form on change to any order field.
			    	$('input', element).on('keyup', function () {
						var values = {};
						$(':input', element).each(function() {
							values[this.name] = $(this).val();
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
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/checkout-items.cjs.jsx"),
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
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/checkout-summary.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="placeOrderButton"]', element).click(function () {
			    		Context.order.submit();
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

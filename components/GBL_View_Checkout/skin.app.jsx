
require("./component.jsx")['for'](module, {




	getTemplates: function (Context) {
		return {
			"form": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/checkout-form.cjs.jsx"),
				markup: function (element) {
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

console.log("MARKUP ITEMS", element.html());

					this.liftSections(element);

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

console.log("REMOVE ITEM!!", data);

							return false;
						});

				    });
				}
			}),
			"summary": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/checkout-summary.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="placeOrderButton"]', element).click(function () {

console.log("PLACE ORDER");

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



	afterRender: function (Context, element) {


		// Remove item from cart
	    Context.ensureForNodes(
	    	$('.button[data-link="action:remove-item"]', element),
	    	'click',
	    	function () {
	    		Context.appContext.get('stores').cart.remove($(this).attr("data-id"));
	    	}
	    );


	    // Save form on change to any order field.
	    Context.ensureForNodes(
	    	$('#form-order select', element),
	    	'change',
	    	function () {
	    		Context.saveForm('#form-order');
	    	}
	    );
	    Context.ensureForNodes(
	    	$('#form-order input', element),
	    	'keyup',
	    	function () {
	    		Context.saveForm('#form-order');
	    	}
	    );


	    // Copy name from info to billing in form
	    Context.ensureForNodes(
	    	$('#form-order input[name="info[name]"]', element),
	    	'keyup',
	    	function () {
	    		var copyName = Context.singleton('copyName');
	    		var newValue = $(this).val();
	    		var existingValue = $('#form-order input[name="card[name]"]', element).val();
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
				$('#form-order input[name="card[name]"]', element).val(copyName.lastValue);
	    	}
	    );

	    // Form submission
	    Context.ensureForNodes(
	    	$('#form-order DIV.button.form-submit', element),
	    	'click',
	    	function () {
	    		Context.saveForm('#form-order');
	    		Context.order.submit();
	    	}
	    );

	},

	getHTML: function (Context) {
console.log("GETC HECKOUT HTML");

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		var panel = null;

		if (!Context.eventToday) {

			panel = (
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

			panel = (
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

			panel = [

				<Context.templates.form.comp />,
				<Context.templates.items.comp />,
				<Context.templates.summary.comp />,

			(
				<div className="sixteen wide column">

					<br/>
					<br/>
					<div className="ui message">
					  <div className="header">
					    Grab something else <a href="#Menu_Web">here</a>
					  </div>
					</div>
					<br/>
					<br/>

					<table className="ui table">
					  <thead>
					    <tr>
					      <th className="ten wide">Item</th>
					      <th className="two wide">Quantity</th>
					      <th className="two wide">Price</th>
					      <th className="two wide">Amount</th>
					    </tr>
					  </thead>
					  <tbody>

			            {Context.items.map(function(item) {
							return (
								<tr key={item.get('id')}>
									<td>

										{item.get("title")}

										{item.get("options")}

										&nbsp;&nbsp;&nbsp;

										<div data-link="action:remove-item" data-id={item.get('id')} className="ui primary button">
											Remove
										</div>

									</td>
									<td>{item.get("quantity")}</td>
									<td>${item.get("format.price")}</td>
									<td>${item.get("format.amount")}</td>
								</tr>
							);
				        })}
					    
					  </tbody>
					</table>
		            
		        </div>

	        )];
	    }

		return (
        	<div className="ui grid">

	        	{Context.components.Header}

	        	{Context.components.Menu}

				<div className="two column row">

		        	{panel}

			    </div>

	        	{Context.components.Footer}

	        </div>
		);
	}
});


require("./component.jsx").for(module, {

	afterRender: function (Context, element) {


		// Remove item from cart
	    Context.ensureForNodes(
	    	$('.button[data-link="action:remove-item"]', element),
	    	'click',
	    	function () {
	    		Context.appContext.stores.cart.remove($(this).attr("data-id"));
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

		Context.ensureForNodes(
            $('.ui.dropdown', element),
            'dropdown()'
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


	    // Fill form with existing values if available.
    	var values = Context.order.get("form");
    	if (values) {
		    $('#form-order input', element).each(function () {
		    	var elm = $(this);
		    	var name = elm.attr("name");
		    	if (values[name]) {
		    		elm.val(values[name]);
		    	}
		    });
			$('#form-order select', element).each(function () {
				var select = $(this);
		    	if (values[select.attr("name")]) {
		    		if ($(this).attr("name") === "card[expire-month]") {
						$('option[value="' + values[select.attr("name")] + '"]', select).prop('selected', true);
			    	}
		    	}
		    });
		}

		if (Context.eventToday) {
			$('[data-fieldname="tip"]', element).dropdown('set selected', Context.eventToday.get("tip"));
		}

	},

	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;

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

			panel = [(
				<div className="sixteen wide column">

					<div className="ui segment">

						<form id="form-order" className="ui form">

							<div className="ui grid">

							    <div className="eight wide column">

								  <h4 className="ui dividing header">Your Info</h4>
								  <div className="fields">
								    <div className="sixteen wide field">
								      <label>Name</label>
								      <input type="text" name="info[name]" placeholder="FirstName LastName"/>
								    </div>
							      </div>
								  <div className="fields">
								    <div className="sixteen wide field">
								      <label>Email</label>
								      <input type="text" name="info[email]" placeholder="Email"/>
								    </div>
							      </div>
								  <div className="fields">
								  	We will email you when your order has arrived!
								  </div>
							    </div>

							    <div className="eight wide column">

									  <h4 className="ui dividing header">Payment Info</h4>
									  <div className="fields">
									    <div className="fourteen wide field">
									      <label>Name on Card</label>
									      <input type="text" name="card[name]" placeholder="FirstName LastName"/>
									    </div>
									    <div className="four wide field">
									      <label>CVC</label>
									      <input type="text" name="card[cvc]" maxlength="3" placeholder="CVC"/>
									    </div>
								      </div>
									  <div className="fields">
									    <div className="ten wide field">
									      <label>Card Number</label>
									      <input type="text" name="card[number]" maxlength="16" placeholder="Card #"/>
									    </div>
									    <div className="eight wide field">
									      <label>Expiration</label>
									      <div className="two fields">
									        <div className="field">
									          <select className="ui fluid search dropdown" name="card[expire-month]">
									            <option value="">Month</option>
									            <option value="1">January</option>
									            <option value="2">February</option>
									            <option value="3">March</option>
									            <option value="4">April</option>
									            <option value="5">May</option>
									            <option value="6">June</option>
									            <option value="7">July</option>
									            <option value="8">August</option>
									            <option value="9">September</option>
									            <option value="10">October</option>
									            <option value="11">November</option>
									            <option value="12">December</option>
									          </select>
									        </div>
									        <div className="field">
									          <input type="text" name="card[expire-year]" maxlength="4" placeholder="Year"/>
									        </div>
									      </div>
									    </div>
									  </div>
									  <div className="ui red button form-submit" tabindex="0">Submit Order</div>

							    </div>

						    </div>

						</form>

					</div>

				</div>
	 	    ), (
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
								<tr key={item.id}>
									<td>

										{item.get("title")}

										{item.get("options")}

										&nbsp;&nbsp;&nbsp;

										<div data-link="action:remove-item" data-id={item.id} className="ui primary button">
											Remove
										</div>

									</td>
									<td>{item.get("quantity")}</td>
									<td>${item.get("format.price")}</td>
									<td>${item.get("format.amount")}</td>
								</tr>
							);
				        })}

					    <tr className="GBL_Skin_lessPadding">
					      <td></td>
					      <td className="right aligned" colSpan="2">Subtotal</td>
					      <td>$8.80</td>
					    </tr>
					    <tr className="GBL_Skin_invisibleRowBorder GBL_Skin_lessPadding">
					      <td></td>
					      <td className="right aligned" colSpan="2">Tax ({Context.eventToday.get("consumerGroup.orderTax")}%)</td>
					      <td>$0.73</td>
					    </tr>
					    <tr className="GBL_Skin_invisibleRowBorder GBL_Skin_lessPadding">
					      <td></td>
					      <td className="right aligned" colSpan="2">Goodybag Fee</td>
					      <td>${Context.eventToday.get("format.goodybagFee")}</td>
					    </tr>
					    <tr className="GBL_Skin_invisibleRowBorder GBL_Skin_lessPadding">
					      <td></td>
					      <td className="right aligned" colSpan="2">
					      	Tip
					      	<div className="ui selection dropdown" data-fieldname="tip">
	                          <div className="default text">Select</div>
		                      <i className="dropdown icon"></i>
		                      <div className="menu">
		                        <div className="item" data-value="5">5%</div>
		                        <div className="item" data-value="10">10%</div>
		                        <div className="item" data-value="15">15%</div>
		                        <div className="item" data-value="20">20%</div>
		                      </div>
		                    </div>
					      </td>
					      <td>
					        $
					        <div className="ui input">
							  <input type="text" placeholder="0.80"/>
							</div>
						  </td>
					    </tr>
					    <tr className="GBL_Skin_invisibleRowBorder">
					      <td></td>
					      <td className="right aligned" colSpan="2">Total</td>
					      <td>$10.33</td>
					    </tr>
					  </tbody>
					</table>
		            
		        </div>

	        )];
	    }

		return (
        	<div className="ui grid">

	        	{Context.appContext.view.components.Header}

	        	{Context.appContext.view.components.Menu.for(Context)}

				<div className="two column row">

		        	{panel}

			    </div>

	        	{Context.appContext.view.components.Footer}

	        </div>
		);
	}
});


require("./component.jsx")['for'](module, {

	afterRender: function (Context, element) {
	},

	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		if (!Context.order) {
			return (
	        	<div className="ui grid">

		        	{Context.appContext.get('view').components.Header}

				    <div className="sixteen wide column">

				    	Order not found!

				    </div>

		        	{Context.appContext.get('view').components.Footer}

				</div>
			);
		}

		return (
        	<div className="ui grid">

	        	{Context.appContext.get('view').components.Header}

			    <div className="sixteen wide column">

			    	<h2>Order Receipt</h2>

			    	<h3>Lunch is ordered!</h3>
			    	<p>Thanks for ordering with Goodybag. You will receive another email when your lunch arrives.</p>

					<table className="ui very basic collapsing table GBL_Skin_invisibleTable GBL_Skin_lessPadding">
					  <tbody>
					    <tr>
					      <td>
					      	<label>Order#:</label>
						  </td>
					      <td>{Context.order.get("number")}</td>
					    </tr>
					    <tr>
					      <td>
					      	<label>Order from:</label>
						  </td>
					      <td>
					      	{Context.order.get("orderFrom")}
					      </td>
					    </tr>
					    <tr>
					      <td>
					      	<label>Delivery Date:</label>
						  </td>
					      <td>
					      	{Context.order.get("format.deliveryDate")}
					      </td>
					    </tr>
					    <tr>
					      <td>
					      	<label>Delivery Time:</label>
						  </td>
					      <td>
					      	{Context.order.get("format.deliveryTime")}
					      </td>
					    </tr>
					    <tr>
					      <td>
					      	<label>Deliver to:</label>
						  </td>
					      <td>
					      	{Context.order.get("event.consumerGroup.contact")}
					      </td>
					    </tr>
					  </tbody>
					</table>

			    </div>

			    <div className="sixteen wide column">

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
									<td>{item.get("title")} {item.get("options")}</td>
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
					      <td className="right aligned" colSpan="2">Tip</td>
					      <td>$0.80</td>
					    </tr>
					    <tr className="GBL_Skin_invisibleRowBorder">
					      <td></td>
					      <td className="right aligned" colSpan="2">Total</td>
					      <td>$10.33</td>
					    </tr>
					  </tbody>
					</table>

			    </div>

	        	{Context.appContext.get('view').components.Footer}

	        </div>
		);
	}
});

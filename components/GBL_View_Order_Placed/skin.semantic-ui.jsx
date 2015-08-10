
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

			    <div className="sixteen wide center aligned column">

			    	<h1 className="ui header">Success!</h1>

			    </div>

			    <div className="sixteen wide center aligned column">

			    	<p>Your order is placed and will be <b>delivered today between {Context.order.get("format.deliveryTime")}</b>.</p>

			    	<p>We have sent you a <a data-link="#Receipt">receipt</a>.</p>

			    	<p>We will send you an email when it arrives.</p>

			    </div>

			    <div className="one column wide centered row">

				    <div className="ten wide center aligned column">

						<div className="ui secondary inverted segment">

						    <p><b>Share this link</b> with coworkers to let them<br/>
						    view the menu and place their own order!</p>

					    	<div className="ui fluid input">
							  <input type="text" placeholder="https://www.goodybag.com/bazaarvoice"/>
							</div>
						</div>

				    </div>
			    </div>

	        	{Context.appContext.get('view').components.Footer}

	        </div>
		);
	}
});

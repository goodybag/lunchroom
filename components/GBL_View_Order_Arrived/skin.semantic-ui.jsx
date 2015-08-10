
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

			    	<h1 className="ui header">Your Lunch is Here!</h1>

			    </div>

			    <div className="sixteen wide center aligned column">

			    	<p>Your food has arrived and is waiting for you at the following location:</p>

			    	<h3>{Context.order.get("event.consumerGroup.pickupLocation")}</h3>

			    </div>

	        	{Context.appContext.get('view').components.Footer}

	        </div>
		);
	}
});

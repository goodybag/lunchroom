
require("./component.jsx")['for'](module, {
	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		return (
        	<div className="ui grid">

	        	{Context.components.Header}

	        	{Context.components.Menu}

				<div>Panel</div>

	        	{Context.components.Footer}

			</div>
        );
	}
});

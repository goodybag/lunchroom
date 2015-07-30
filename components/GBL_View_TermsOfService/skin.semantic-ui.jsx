
require("./component.jsx").for(module, {

	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;


        return (
        	<div className="ui grid">

	        	{Context.appContext.view.components.Header}

	        	{Context.appContext.view.components.Menu.for(Context)}

			    <div className="sixteen wide column">

			    	Terms of Service

				</div>

	        	{Context.appContext.view.components.Footer}

			</div>
        );
	}
});

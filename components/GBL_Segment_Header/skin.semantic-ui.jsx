
require("./component.jsx")['for'](module, {
	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		return (
    	    <div id="page-header" className="sixteen wide column">

				<h1 className="ui header"><a href="#" data-link="#Landing">Goodybag</a></h1>

			</div>
        );
	}
});


require("./component.jsx").for(module, {
	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;

		return (
			<main>
				TODO: Menu Web
		    </main>
        );
	}
});

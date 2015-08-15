
require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {

		return {
			"landing":  new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/Landing/page.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {
				}
			})
		};
	},


	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		return (
        	<Context.templates.landing.comp />
		);
	}
});

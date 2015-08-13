
require("./component.jsx")['for'](module, {
	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		return (
        	<div id="page-footer" className="sixteen wide column">

				<div className="ui secondary center aligned segment">
				  <p><a data-link="#ContactUs">Contact Us</a> | <a data-link="#TermsOfService">Terms of Service</a> | <a data-link="#PrivacyPolicy">Privacy Policy</a></p>
				</div>

			</div>
        );
	}
});

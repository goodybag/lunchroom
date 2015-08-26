
var console = require("../../app/lib/console");


require("./component.jsx")['for'](module, {

	getTemplate: function (Context) {

		return new Context.Template({
			impl: require("../../www/lunchroom-landing~0/components/AppMenu/header.cjs.jsx"),
			markup: function (element) {
				var self = this;

				$('[data-component-elm="signupLink"]', element).click(function () {
console.log("TODO: Signup");
					return false;
				});

				$('[data-component-elm="loginLink"]', element).click(function () {
console.log("TODO: Login");
					return false;
				});

// TODO: Remove once account management is working.
$('[data-component-elm="signupLink"]', element).hide();
$('[data-component-elm="loginLink"]', element).hide();

// TODO: Remove this once we call the skin app or can locate code with components.
$('[data-toggle="tooltip"]').tooltip();

			},
			fill: function (element, data, Context) {				
			}
		});
	}
});

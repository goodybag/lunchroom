
var console = require("../../app/lib/console");

require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {

		return {
			"landing":  new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/Landing/page.cjs.jsx"),
				markup: function (element) {


					$('#contact-us-form', element).submit(function () {

						$('[data-dismiss="modal"]').click();

			    		var formElm = $('#contact-us-form', element);

			    		var payload = {
			    			name: $('[data-component-elm="name"]', formElm).val(),
			    			email: $('[data-component-elm="email"]', formElm).val(),
			    			message: $('[data-component-elm="message"]', formElm).val()
			    		};

	console.log("payload", payload);

						$.ajax({
							method: "POST",
							url: "/contact-us",
							contentType: "application/json",
							data: JSON.stringify(payload),

							success: function ( data, textStatus, jqXHR ) {

				    			$('[data-component-elm="message"]', formElm).val("");
							},

							error: function (jqXHR, textStatus, errorThrown) {

	console.log("error");

	console.log("jqXHR", jqXHR);
	console.log("textStatus", textStatus);
	console.log("errorThrown", errorThrown);

	/*
								if (err.status === 200) {
									// This happens on IE 8 & 9.
									// We had success after all.
									return;
								}

								for (var name in err) {
									console.error("ERR " + name + ": " + err[name]);
								}
								console.error("Error status code: " + err.statusCode);
								console.log("Error sending message to server!" + err.stack || err.message || err);
		// TODO: Display error.
	*/
							}
						});
						return false;
			    	});


					$('[data-component-id="subscribe"]', element).submit(function () {


//		    			var errorMessage = $('#form-subscribe DIV[data-message="form-error"]', element);
//		    			var successMessage = $('DIV[data-message="form-sent"]', element);

//		    			errorMessage.addClass("hidden");
//		    			successMessage.addClass("hidden");
//		    			$('#form-subscribe DIV[data-message="subscription-pending"]', element).addClass("hidden");

			    		var emailElement = $('[data-component-elm="email"]', element);
			    		if (!emailElement.val()) {
/*
			    			if (Context.config.doNothingOnEmptyEmailSubmit !== true) {
				    			$("p", errorMessage).html("You must enter your email address!");
				    			errorMessage.removeClass("hidden");
				    			emailElement.one("keyup", function () {
					    			errorMessage.addClass("hidden");
				    			});
				    			setTimeout(function () {
					    			errorMessage.addClass("hidden");
				    			}, 5000);
				    		}
*/
			    			return false;
			    		}
			    		// TODO: Validate email.

			    		Context.subscribeWithEmail(emailElement.val());

			    		$('[data-component-id="subscribe"').addClass("hidden");

//						successMessage.removeClass("hidden");
//						$("#form-subscribe").addClass("hidden");
						return false;
					});
				},
				fill: function (element, data, Context) {

					var consumerGroupSubscription = Context.consumerGroupSubscription;
					if (consumerGroupSubscription) {
						this.fillElements(element, {
							email: consumerGroupSubscription.get("subscribeEmail")
						});
					}

				}
			}),
// TODO: Put subscription logic here and use this template instead of adding it to 'page' above.			
			"subscribe": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/Landing/subscribe.cjs.jsx"),
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


require("./component.jsx")['for'](module, {

	getTemplate: function (Context) {

		return new Context.Template({
			impl: require("../../www/lunchroom-landing~0/components/AppMenu/footer.cjs.jsx"),
			markup: function (element) {
				var self = this;

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

			},
			fill: function (element, data, Context) {

// TODO: Pre-fill email if available in local storage.

			}
		});
	}
});


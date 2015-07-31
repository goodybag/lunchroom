
require("./component.jsx").for(module, {

	afterRender: function (Context, element) {
		var self = this;

	    // Form submission
	    Context.ensureForNodes(
	    	$('#form-subscribe DIV.button.submit', element),
	    	'click',
	    	function () {
    			var errorMessage = $('#form-subscribe DIV.message.negative', element);
    			var successMessage = $('DIV.message.success', element);

    			errorMessage.addClass("hidden");
    			successMessage.addClass("hidden");

	    		var emailElement = $('#form-subscribe input[type="email"]', element);
	    		if (!emailElement.val()) {
	    			$("p").html("You must enter your email address!");
	    			errorMessage.removeClass("hidden");
	    			emailElement.one("keyup", function () {
		    			errorMessage.addClass("hidden");
	    			});
	    			setTimeout(function () {
		    			errorMessage.addClass("hidden");
	    			}, 5000);
	    			return;
	    		}
	    		// TODO: Validate email.

	    		Context.subscribeWithEmail(emailElement.val());

				successMessage.removeClass("hidden");
				$("#form-subscribe").html("");
	    	}
	    );
	},

	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;

		var consumerGroup = Context.consumerGroup;
		
		if (!consumerGroup) {
	        return (
	        	<div className="ui one column centered grid">

				    <div className="row">

					    <div className="eight wide column">

					    	Loading ...

					    </div>
				    </div>
			    </div>
			);
		}

        return (
        	<div className="ui one column centered grid">

			    <div className="row">

				    <div className="eight wide column">

				    	<h2 className="header">{consumerGroup.get("title")}</h2>

						<form id="form-subscribe" className="ui form">

							<div className="ui form">
							  <div className="field">
							    <label>E-mail</label>
							    <input type="email" placeholder=""/>
							  </div>

							<div className="ui negative hidden message">
							  <i className="close icon"></i>
							  <div className="header">
							    Oops!
							  </div>
							  <p></p>
							</div>

							  <div className="ui submit button">Submit</div>
							</div>

						</form>

					  <div className="ui success hidden message">
					    <div className="header">Form Completed</div>
					    <p>We have sent you an email to confirm your subscription!</p>
					  </div>

					</div>
				</div>

			    <div className="row">

				    <div className="eight wide column">

						<a href="/bazaarvoice/todo-day-context-id-hash">Go to Menu</a>

					</div>

				</div>

			</div>
        );
	}
});

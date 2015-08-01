
require("./component.jsx").for(module, {

	afterRender: function (Context, element) {
		var self = this;

	    // Form submission
	    Context.ensureForNodes(
	    	$('#form-subscribe DIV.button.submit', element),
	    	'click',
	    	function () {
    			var errorMessage = $('#form-subscribe DIV[data-message="form-error"]', element);
    			var successMessage = $('DIV[data-message="form-sent"]', element);

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

		var consumerGroupSubscription = Context.consumerGroupSubscription;

		if (consumerGroupSubscription) {
    		var emailElement = $('#form-subscribe input[type="email"]', element);
    		emailElement.val(consumerGroupSubscription.get("subscribeEmail"));

    		if (
    			consumerGroupSubscription.get("subscribeEmail")
    			===
    			consumerGroupSubscription.get("confirmedEmail")
    		) {
    			$('#form-subscribe DIV[data-message="subscription-confirmed"]', element).removeClass("hidden");
    		} else {
    			$('#form-subscribe DIV[data-message="subscription-pending"]', element).removeClass("hidden");
    		}
		}
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

		var consumerGroupSubscription = Context.consumerGroupSubscription;

		var UnsubscribeLink = "";
		if (consumerGroupSubscription) {
			var unsubscribeLink = window.location.origin + "/a/us/" + consumerGroupSubscription.get("token");
			UnsubscribeLink = <a href={unsubscribeLink}>Unsubscribe</a>;
		}

        return (
        	<div className="ui one column centered grid">

			    <div className="row">

				    <div className="eight wide column">

				    	<h2 className="header">{consumerGroup.get("title")}</h2>

						<form id="form-subscribe" className="ui form">

							<div className="ui success form">
							  <div className="field">
							    <label>E-mail</label>
							    <input type="email" placeholder=""/>
							  </div>

							  <div data-message="subscription-confirmed" className="ui success hidden message">
							    <p>Your subscription is confirmed for this email address! {UnsubscribeLink}</p>
							  </div>
							  <div data-message="subscription-pending" className="ui negative hidden message">
							    <p>Your subscription for this email address is pending. Click Submit to resend.</p>
							  </div>

							<div data-message="form-error" className="ui negative hidden message">
							  <i className="close icon"></i>
							  <div className="header">
							    Oops!
							  </div>
							  <p></p>
							</div>

							  <div className="ui submit button">Submit</div>
							</div>

						</form>

					  <div data-message="form-sent" className="ui success hidden message">
					    <div className="header">Form Completed</div>
					    <p>We have sent you an email to confirm your subscription!</p>
					  </div>

					</div>
				</div>

			</div>
        );
	}
});

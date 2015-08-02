
require("./component.jsx").for(module, {

	afterRender: function (Context, element) {
		var self = this;

	    // Form submission
	    Context.ensureForNodes(
	    	$('#form-subscribe .submit-button', element),
	    	'click',
	    	function () {

    			var errorMessage = $('#form-subscribe DIV[data-message="form-error"]', element);
    			var successMessage = $('DIV[data-message="form-sent"]', element);

    			errorMessage.addClass("hidden");
    			successMessage.addClass("hidden");
    			$('#form-subscribe DIV[data-message="subscription-pending"]', element).addClass("hidden");


	    		var emailElement = $('#form-subscribe input[type="email"]', element);
	    		if (!emailElement.val()) {
	    			$("p", errorMessage).html("You must enter your email address!");
	    			errorMessage.removeClass("hidden");
	    			emailElement.one("keyup", function () {
		    			errorMessage.addClass("hidden");
	    			});
	    			setTimeout(function () {
		    			errorMessage.addClass("hidden");
	    			}, 5000);
	    			return false;
	    		}
	    		// TODO: Validate email.

	    		Context.subscribeWithEmail(emailElement.val());

				successMessage.removeClass("hidden");
				$("#form-subscribe").addClass("hidden");

				return false;
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
    			$('DIV[data-message="subscription-confirmed"] .email', element).html(consumerGroupSubscription.get("subscribeEmail"));
    			$('DIV[data-message="subscription-confirmed"]', element).removeClass("hidden");
    			$("#form-subscribe").addClass("hidden");
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
        	<div>
				<header className="navbar navbar-transparent navbar-transparent-dark">
				  <div className="container">
			        <img src="/img/logo_goodybag_white.png" alt="Goodybag.com" className="navbar-logo"/>
				    <ul className="nav navbar-nav navbar-right">
				      <li>
				        <a href="#" data-link="#ContactUs">Contact Us</a>
				      </li>
				    </ul>
				  </div>
				</header>

	  			<section className="page-section hero-unit primary-section" id="email-signup-cta">
				  <div className="container">
				    <h1 className="section-header">Delicious meals delivered every day.</h1>
				    <p>Your choice of lunch brought to you at work. Launches August 1st, 2015.</p>

					  <div data-message="form-sent" className="ui success hidden message">
					    <div className="header">Form Completed</div>
					    <p>We have sent you an email to confirm your subscription!</p>
					  </div>

					  <div data-message="subscription-confirmed" className="ui success hidden message">
					    <p>Your subscription is confirmed for <b className="email"></b>! {UnsubscribeLink}</p>
					  </div>

				    <form id="form-subscribe" className="cta-form form">

					  <div data-message="subscription-pending" className="ui negative hidden message">
					    <p>Your subscription for this email address is pending. You can re-send it.</p>
					  </div>

						<div data-message="form-error" className="ui negative hidden message">
							<i className="close icon"></i>
							<div className="header">
								Oops!
							</div>
							<p></p>
						</div>

				      <div className="form-group">
				        <div className="email-wrapper">
				          <input type="email" name="email"/>
				        </div>
				        <div className="submit-wrapper">
				          <button className="btn btn-primary submit-button">Get notified</button>
				        </div>
				      </div>
				      <p className="form-explanation">Enter your email to receive daily menus when we launch!</p>
				    </form>
				    <h2 className="outro-header">Share the love! Send this page to your coworkers.</h2>
				  </div>
				</section>

				<section className="page-section" id="how-it-works">
				  <div className="container">
				    <h1 className="section-title">How it'll work</h1>
				    <div className="marketing-points">
				      <div className="point">
				        <img src="/img/icons_step1.png" alt="Restaurant rotation"/>
				        <p>One restaurant featured each day.</p>
				      </div>
				      <div className="point">
				        <img src="/img/icons_step2.png" alt="Order deadline"/>
				        <p>Order by 10 AM.</p>
				      </div>
				      <div className="point">
				        <img src="/img/icons_step3.png" alt="Delivery notification"/>
				        <p>We'll deliver your food at 12 and text you when it arrives!</p>
				      </div>
				    </div>
				  </div>
				</section>

				<section className="page-section section-dark" id="new-menu-everyday">
				  <div className="container">
				    <h1 className="section-title">A new menu every day</h1>
				    <img src="/img/browsers_3mockups.png" className="section-screenshot" alt="Menu screenshot"/>
				  </div>
				</section>

				<section className="page-section" id="restaurants">
				  <div className="container">
				    <h1 className="section-title">A few restaurants you can expect</h1>
				    <ul className="logo-list">
				      <li><img src="/img/logo_trudys.png" alt="Trudy's"/></li>
				      <li><img src="/img/logo_micklethwait.png" alt="Micklethwait"/></li>
				      <li><img src="/img/logo_torchys.png" alt="Torchy's Tacos"/></li>
				      <li><img src="/img/logo_zoes.png" alt="Zoe's Kitchen"/></li>
				      <li><img src="/img/logo_madammams.png" alt="Madam Mam's"/></li>
				    </ul>
				  </div>
				</section>

				<footer className="footer">
				  <ul className="nav footer-nav">
				    <li><a data-link="#ContactUs">Contact Us</a></li>
				    <li><a data-link="#TermsOfService">Terms of service</a></li>
				    <li><a data-link="#PrivacyPolicy">Privacy policy</a></li>
				  </ul>
				</footer>

        	</div>
		);
	}
});

/*
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

							  <div className="ui submit button submit-button">Submit</div>
							</div>

						</form>

					  <div data-message="form-sent" className="ui success hidden message">
					    <div className="header">Form Completed</div>
					    <p>We have sent you an email to confirm your subscription!</p>
					  </div>

					</div>
				</div>

			</div>
*/


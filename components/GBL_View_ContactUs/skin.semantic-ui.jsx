
require("./component.jsx").for(module, {

	afterRender: function (Context, element) {
		var self = this;

	    // Form submission
	    Context.ensureForNodes(
	    	$('#form-contact-us button[type="submit"]', element),
	    	'click',
	    	function () {

	    		var payload = {
	    			name: $('#form-contact-us input[name="contactName"]').val(),
	    			email: $('#form-contact-us input[name="contactEmail"]').val(),
	    			message: $('#form-contact-us textarea[name="contactMessage"]').val()
	    		};

console.log("payload", payload);

				$.ajax({
					method: "POST",
					url: "https://www.goodybag.com/contact-us",
					contentType: "application/json",
					headers: {
						"Accept": "application/json"
					},
	    			dataType: "json",
					data: JSON.stringify(payload)
				})
				.done(function (response) {

console.log("response", response);

				})
				.fail(function(err) {

console.log("Error sending message to server!", err.stack);

				});
				return false;
	    	}
	    );
	},

	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;


        return (
        	<div className="ui grid page-content">

	        	{Context.appContext.view.components.Header}

			    <div className="sixteen wide column">


					<div className="ui two column centered grid">
					  <div className="four column centered row">
					    <div className="six wide column">

					    	<h1 className="ui header">We're here for you!</h1>

					    	<p>Please get in touch with anything at all -- questions, help, ideas, or just to say hello.</p>
					    	<p><b>Orders:</b> If you need an order placed ASAP, we'll take care of it for you! Just let us know when and where (plus any preferences) and we'll make it happen.</p>

							<p>Are you a restaurant or caterer? <a href="https://www.goodybag.com/request-to-be-a-caterer">Learn more here!</a></p>

							<div className="ui list">
							  <div className="item">
							    <i className="university icon"></i>
							    <div className="content">
							      <strong>Hours of Operation</strong>
					              <p>Monday thru Friday <br/>
					                 6AM to 7PM Central
					              </p>
							    </div>
							  </div>
							  <div className="item">
							    <i className="mail icon"></i>
							    <div className="content">
							      <strong>Email</strong>
              					  <p><a href="mailto:support@goodybag.com">support@goodybag.com</a></p>
							    </div>
							  </div>
							  <div className="item">
							    <i className="phone icon"></i>
							    <div className="content">
							      <strong>Phone</strong>
              					  <p>(512) 677-4224</p>
							    </div>
							  </div>
							</div>

					    </div>
					    <div className="six wide column">

							<form id="form-contact-us" className="ui form">
							  <div class="field">
							    <label>First Name</label>
							    <input type="text" name="contactName" placeholder="Enter Name"/>
							  </div>
							  <div className="field">
							    <label>Last Name</label>
							    <input type="text" name="contactEmail" placeholder="Enter Email"/>
							  </div>
							  <div className="field">
							    <label>Text</label>
							    <textarea rows="5" name="contactMessage" placeholder="Enter Message"></textarea>
							  </div>
							  <button className="ui button" type="submit">Send</button>
							</form>

					    </div>
					  </div>
					</div>


				</div>

	        	{Context.appContext.view.components.Footer}

			</div>
        );
	}
});

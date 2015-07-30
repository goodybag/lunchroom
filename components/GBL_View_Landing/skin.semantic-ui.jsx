
require("./component.jsx").for(module, {

	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;


        return (
        	<div className="ui one column centered grid">

			    <div className="row">

				    <div className="eight wide column">

						<div className="ui form success">
						  <div className="field">
						    <label>E-mail</label>
						    <input type="email" placeholder="joe@schmoe.com"/>
						  </div>
						  <div className="ui success message">
						    <div className="header">Form Completed</div>
						    <p>You are all signed up for the newsletter.</p>
						  </div>
						  <div className="ui submit button">Submit</div>
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

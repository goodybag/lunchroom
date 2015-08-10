
require("./component.jsx")['for'](module, {
	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		return (
			<main>
		      <div className="container">
		        <div className="actions">
		          <a href="/">Back</a>
		        </div>

		        <form className="panel form-checkout" action="">
		          <div className="user-info-group">
		            <h1>Your Info</h1>
		            <div className="form-group">
		              <label data-for="name">Name</label>
		              <input type="text" id="name"/>
		            </div>
		            <div className="form-group">
		              <label data-for="name">Email</label>
		              <input type="email" id="email"/>
		            </div>
		            <div className="form-group">
		              <i>We will email you when your meal has arrived!</i>
		            </div>
		          </div>
		          <div className="payment-info-group">
		            <h1>Payment Info</h1>
		            <div className="form-group">
		              <label data-for="name-on-card">Name on card</label>
		              <input type="text" id="name-on-card"/>
		            </div>
		            <div className="form-group">
		              <label data-for="card-num">Card Number</label>
		              <input type="text" id="card-num"/>
		            </div>
		            <div className="form-group">
		              <label data-for="card-cvc">CVC</label>
		              <input type="text" id="card-num"/>
		            </div>
		            <div className="form-group">
		              <label data-for="card-exp-month">Exp Month
		                <input className="input-half" type="text" id="card-exp-month"/>
		              </label>
		              <label data-for="card-exp-year">Exp Year
		                <input className="input-half" type="text" id="card-exp-year"/>
		              </label>
		            </div>
		          </div>
		        </form>
		      </div>
		    </main>
        );
	}
});

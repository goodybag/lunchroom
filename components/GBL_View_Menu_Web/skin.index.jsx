
require("./component.jsx")['for'](module, {
	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;


		var Items = "";
		// TODO: Base on active selection.
		if (Context.day) {
			Items = [(
				<div className="row">
		          <div className="lead">
		            <h1>Dos Batos Wood Fire Tacos</h1>
{			            
		            //.share-linkspan <b>Share this link</b> with coworkers to let them view the menu and place their own order!
		            //input(type="text", value=" http://goodybag.com/bazaarvoice")
}
		          </div>
		        </div>
		    	),(
		        <div className="cards">
					
					{Context.day.map(function (item) {
{
	// ##################################################
	// # Menu item summary card
	// ##################################################
}
						return (
				          <div key={item.get("id")} className="card">
				            <div className="cover">
						      <img src="https://cdn.filepicker.io/api/file/6PqREn6qQHWCQsPdKJXK/convert?cache=true&fit=scale"/>
				            </div>
				            <div className="info">
				              <h1>{item.get("item.title")}</h1>
				              <button className="btn btn-add">+ Add</button><span>Spicy Vegetarian</span>
				              <div className="details">$10.90</div>
				            </div>
				          </div>
						);
					})}

		        </div>
	        )];
		}

        return (
        	<div>
{
	// ##################################################
	// # Header
	// ##################################################
}
				<nav>
			      <div className="container">
			        <h1 className="logo">Goodybag</h1>
			      </div>
			    </nav>
{
	// ##################################################
	// # Menu
	// ##################################################
}
			    <header>
			      <div className="container">
			        <ul className="details-list">
			          <li>
			            <h1>Deliver To:</h1>
			            <div>Bazaarvoice</div>
			          </li>
			          <li>
			            <h1>Delivery Time:</h1>
			            <div>12:00 - 12:30pm</div>
			          </li>
			          <li className="warning">
			            <h1>Time left to order:</h1>
			            <div>1 hr 26 min</div>
			          </li>
			          <li>
			            <button className="btn btn-checkout">Checkout (1)</button>
			          </li>
			        </ul>
			        <ul className="dates">
						{Object.keys(Context.days).map(function (day) {
							var item = Context.days[day][0];
							return (
								<li key={item.get("id")}>{item.get("day.format.ddd")}<small>{item.get("day.format.MMM")} {item.get("day.format.D")}</small></li>
							);
						})}
			        </ul>
			      </div>
			    </header>
{
	// ##################################################
	// # Page Header
	// ##################################################
}
			    <main>
			      <div className="container">
			        {Items}
			      </div>
			    </main>
{
	// ##################################################
	// # Footer
	// ##################################################
}
			    <footer>
			      <ul>
			        <li><a href="#">Contact Us</a></li>
			        <li><a href="#">Terms of Service</a></li>
			        <li><a href="#">Privacy Policy</a></li>
			      </ul>
			    </footer>
        	</div>
        );
	}
});

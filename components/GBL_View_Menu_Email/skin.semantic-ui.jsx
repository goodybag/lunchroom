
require("./component.jsx").for(module, {
	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;


		var Items = "";
		// TODO: Base on active selection.
		Items = (
			<div className="sixteen wide column">
				<div className="ui cards">

					{Context.items.map(function (item) {								
{
// ##################################################
// # Menu item summary card
// ##################################################
}

						return (
						  <div key={item.get('id')} className="card">
						    <a data-link="#Menu_Web" className="image">
						      <img src="https://cdn.filepicker.io/api/file/6PqREn6qQHWCQsPdKJXK/convert?cache=true&fit=scale"/>
						    </a>
						    <div className="content">
						      <a className="header">{item.get("item.title")}</a>
						      <div className="meta">
						        HOT
						      </div>
						      <div className="description">
							    <b>${item.get("item.format.price")}</b> &nbsp;&nbsp;&nbsp; {item.get("item.description")}
							  </div>
						    </div>
						  </div>
						);
					})}

				</div>
		    </div>
		);

        return (
        	<div className="ui grid">

	        	{Context.appContext.view.components.Header}

			    <div className="sixteen wide center aligned column">

					<h1 className="ui header">Free Lunch Delivery!</h1>

				</div>
			    <div className="sixteen wide center aligned column">

					<div data-link="#Menu_Web" className="ui primary button">
					  Order now!
					</div>

				</div>

			    <div className="sixteen wide column">

					<div className="ui secondary segment">

					  <p><b>New menus every day!</b> Today's menu is from <b>{Context.vendor.title}</b>.</p>

					  <div dangerouslySetInnerHTML={{__html: Context.vendor.description}}></div>

					  <p><b>Place your order by 10 AM for lunch today.</b></p>
					</div>

				</div>

{
// ##################################################
// # Page Content (for today)
// ##################################################
}

			    {Items}

			    <div className="sixteen wide column">

					<div className="ui secondary segment">
					  <p>More enticing text ...</p>
					</div>

				</div>

{
// ##################################################
// # Footer
// ##################################################
}

			    <div className="sixteen wide center aligned column">

					<div data-link="#Menu_Web" className="ui primary button">
					  Order now!
					</div>

				</div>

	        	{Context.appContext.view.components.Footer}

			</div>
        );
	}
});

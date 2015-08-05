
require("./component.jsx").for(module, {
	afterRender: function (Context, element) {

		$('.tab', element).removeClass('active');
	    $('.tab[data-tab="' + Context.appContext.selectedDay + '"]', element).addClass('active');

	    Context.ensureForNodes(
	    	$('[data-link="action:add"]', element),
	    	'click',
	    	function () {

	    		var itemBlock = $(this).parentsUntil(element, '.item-block');

	    		var error = false;
	    		var options = {};
	    		$('.ui.dropdown', itemBlock).each(function () {
	    			var value = $(this).dropdown("get value");
	    			if (value) {
		    			options[$(this).attr("data-option")] = value;
	    				$(this).removeClass("error");
	    			} else {
	    				$(this).addClass("error");
	    				error = true;
	    			}
	    		});

	    		if (error) return;

		        $('.ui.modal[data-id="' + itemBlock.attr("data-id") + '"][data-day="' + itemBlock.attr("data-day") + '"]').modal('hide');

				Context.appContext.stores.cart.addItem(itemBlock.attr("data-id"), options);
	    	}
	    );

		Context.ensureForNodes(
            $('.ui.dropdown', element),
            'dropdown()'
        );

	    Context.ensureForNodes(
	    	$('a[data-link="action:show-detail"]', element),
	    	'click',
	    	function () {

	    		var itemBlock = $(this).parentsUntil(element, '.item-block');

		        $('.ui.modal[data-id="' + itemBlock.attr("data-id") + '"][data-day="' + itemBlock.attr("data-day") + '"]').modal({
					onDeny: function() {
						return true;
					},
					onApprove : function() {
						return false;
					}
		        }).modal('show');
	    	}
	    );

	},
	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		const React = Context.REACT;

		var Panel = "";

		if (Context.eventToday) {

			if (Context.eventToday.ordersLocked) {

				Panel = (
					<div className="sixteen wide column">

				    	<h2 className="ui header">The order window for this event has closed!</h2>

				    </div>
				);

			} else {

				var Items = "";
				if (Object.keys(Context.items).length > 0) {

					// TODO: Base on active selection.
					Items = (
						<div className="sixteen wide column">
							{Object.keys(Context.days).map(function(day) {

								function makeOptions (item) {
									var Options = [];
									var options = JSON.parse(item.get("item.options") || "{}");
									Object.keys(options).forEach(function (name) {
										Options.push(
											<div className="two fields">
												<div className="ui pointing right label">{name}</div>
												<select data-option={name} className="ui dropdown">
												    <option value="">Please select ...</option>
													{options[name].map(function (value) {
												    	return <option className="item" key={value} value={value}>{value}</option>
											    	})}												  
												</select>
											</div>
										);
									});
									if (Options.length === 0) Options = "";
									return Options;
								}

					        	return (
									<div key={day} className="ui bottom attached tab segment" data-tab={day}>

										<div className="ui cards">

											{Context.items[day].map(function (item) {								

												var Spiciness = "";
												var properties = JSON.parse(item.get("item.properties") || "{}");
												if (properties && properties.Spiciness) {
													Spiciness = (<div>{properties.Spiciness}</div>);
												}

												var OrderButton = "";
												if (Context.days[day].get("canOrder")) {
													OrderButton = (
														<div data-link="action:add" data-id={item.get('item_id')} data-day={day} className="ui bottom attached button">
													      <i className="add icon"/>
													      Add Dish
													    </div>
													);
												}

												return (
												  <div key={item.get('id')} data-id={item.get('item_id')} data-day={day} className="card item-block">
												    <a className="image" data-link="action:show-detail">
												      <img className="ui medium rounded image" src={item.get("item.photo_url")}/>
												    </a>
												    <div className="content">
												      <a className="header">{item.get("item.title")}</a>
												      <div className="meta">
												        {Spiciness}
												      </div>
												      <div className="description">
													    <b>${item.get("item.format.price")}</b> &nbsp;&nbsp;&nbsp; {item.get("item.description")}
													  </div>
												    </div>
												    <form className="ui fluid form">
													    {makeOptions(item)}
												    </form>
												    {OrderButton}
												  </div>
												);
											})}

										</div>

										{Context.items[day].map(function (item) {

											var Spiciness = "";
											var properties = JSON.parse(item.get("item.properties") || "{}");
											if (properties && properties.Spiciness) {
												Spiciness = (<div>{properties.Spiciness}</div>);
											}

											return (
												<div key={item.get('id')} data-id={item.get('item_id')} data-day={day} className="ui modal item-block">
												  <i className="close icon"></i>
												  <div className="header">
												  	{item.get("item.title")}
												  </div>
												  <div className="content">
												    <div className="ui medium image">
												      <img className="ui medium rounded image" src={item.get("item.photo_url")}/>
												    </div>
												    <div className="description">
												    	<p>{Spiciness}</p>
												        <p><b>${item.get("item.format.price")}</b> &nbsp;&nbsp;&nbsp; {item.get("item.description")}</p>
												        <form className="ui fluid form">
														    {makeOptions(item)}
												    	</form>
												    </div>
												  </div>
												  <div className="actions">
												    <div className="ui black deny button">
												      No thanks!
												    </div>
												    <div data-link="action:add" className="ui positive right labeled icon button">
												      Add Dish
												    </div>
												  </div>
												</div>
											);
										})}

									</div>
					        	);
					        })}
					    </div>
					);
				}

				Panel = [(
					<div className="two column row">

					    <div className="six wide left aligned column">

					    	<h2 className="ui header">Restaurant Title</h2>

					    </div>
					    <div className="ten wide column">

					    </div>
				    </div>
				), Items];

			}
		}

        return (
        	<div className="ui grid">

	        	{Context.appContext.view.components.Header}

	        	{Context.appContext.view.components.Menu.for(Context)}

				{Panel}

			    {Context.appContext.view.components.Footer}

			</div>
        );
	}
});


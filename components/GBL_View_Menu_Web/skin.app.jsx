
require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {
		return {
			"menu": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppComponents/menu.cjs.jsx"),
				markup: function (element) {

					this.liftSections(element);

				},
				fill: function (element, data, Context) {

					var items = Context.items[Context.appContext.get('selectedDay')];

					if (items) {

						this.renderSection("items", items.map(function(item) {
							return {
								"id": item.get('id'),
								"item_id": item.get('item_id'),
								"photoUrl": item.get("item.photo_url"),
								"title": item.get("item.title"),
								"price": item.get("item.format.price"),
								"description": item.get("item.description"),
							};
						}), function getView (data) {
							return 'default';
					    }, function hookEvents(elm, data) {

							$('[data-component-elm="addButton"]', elm).click(function () {

					    		var options = {};
/*
					    		var itemBlock = $(this).parentsUntil(element, '.item-block');

					    		var error = false;
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

								Context.appContext.get('stores').cart.addItem(itemBlock.attr("data-id"), options);
*/

								Context.appContext.get('stores').cart.addItem(data.item_id, options);
								return false;
							});
					    });
					}
				}
			})
		};
	},

	afterRender: function (Context, element) {

		$('.tab', element).removeClass('active');
	    $('.tab[data-tab="' + Context.appContext.get('selectedDay') + '"]', element).addClass('active');

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
		var React = Context.REACT;

		var Panel = "";

		if (Context.eventToday) {

			if (Context.eventToday.get("ordersLocked")) {

				Panel = (
					<div className="sixteen wide column">

				    	<h2 className="ui header">The order window for this event has closed!</h2>

				    </div>
				);

			} else {

				Panel = [

				<Context.templates.menu.comp />
/*
				(
					<div className="two column row">

					    <div className="six wide left aligned column">

					    	<h2 className="ui header">Restaurant Title</h2>

					    </div>
					    <div className="ten wide column">

					    </div>
				    </div>
				), Items];
*/
				];
			}
		}

        return (
        	<div>

	        	{Context.components.Header}

	        	{Context.components.Menu}

				{Panel}

	        	{Context.components.Footer}

			</div>
        );
	}
});


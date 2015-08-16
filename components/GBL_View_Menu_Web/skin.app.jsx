
require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {
		return {
			"menu_signup": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/menu-signup.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"orderBy": Context.eventToday.get('format.orderByTime')
					});
				}
			}),			
			"too_late": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/too-late.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {

					this.fillProperties(element, {
						"orderBy": Context.eventToday.get('format.orderByTime')
					});
				}
			}),
			"menu_not_created": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/menu-not-created.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {
				}
			}),
			"popup": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/menu-item-popup.cjs.jsx"),
				markup: function (element) {
					var self = this;

					self.liftSections(element);

					$('[data-component-elm="addButton"]', element).click(function () {

						Context.appContext.get('stores').cart.addItem(self.getData().item_id, {});
						return false;
					});
				},
				fill: function (element, data, Context) {

					this.fillProperties(element, data)

					if (
						Context.selectedEvent &&
						Context.selectedEvent.get("day_id") === Context.appContext.get('todayId') &&
						parseInt(Context.selectedEvent.get("format.orderTimerSeconds") || 0)
					) {
						this.showViews(element, [
							"orderable"
						]);
					} else {
						this.showViews(element, []);
					}
				}
			}),
			"menu": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/menu.cjs.jsx"),
				markup: function (element) {
					this.liftSections(element);
				},
				fill: function (element, data, Context) {
					var self = this;

					var items = Context.items[Context.appContext.get('selectedDay')] || [];

					self.renderSection("items", items.map(function(item) {
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

						$('[data-component-elm="showDetailsLink"]', elm).click(function () {
							Context.templates.popup.fill(data);
						});

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

						if (
							Context.selectedEvent &&
							Context.selectedEvent.get("day_id") === Context.appContext.get('todayId') &&
							parseInt(Context.selectedEvent.get("format.orderTimerSeconds") || 0)
						) {
							self.showViews(elm, [
								"orderable"
							]);
						} else {
							self.showViews(elm, []);
						}
				    });
				}
			})
		};
	},
/*
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
*/
	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		var Panel = "";

		var items = Context.items[Context.appContext.get('selectedDay')] || [];
		
		if (
			Context.eventToday &&
			items.length > 0
		) {

			if (
				Context.appContext.get('selectedDayId') === Context.appContext.get('todayId') &&
				parseInt(Context.eventToday.get("format.orderTimerSeconds") || 0) <= 0
			) {

				Panel = (
					<div>
						<Context.templates.too_late.comp />
						<Context.templates.popup.comp />
						<Context.templates.menu.comp />
						<Context.templates.menu_signup.comp />
					</div>
				);

			} else {

				Panel = (
					<div>
						<Context.templates.popup.comp />
						<Context.templates.menu.comp />
						<Context.templates.menu_signup.comp />
					</div>
				);
			}

		} else {
			Panel = <Context.templates.menu_not_created.comp />
		}

        return (
        	<div className="page page-menu">

	        	{Context.components.Header}

	        	{Context.components.Menu}

				{Panel}

	        	{Context.components.Footer}

			</div>
        );
	}
});


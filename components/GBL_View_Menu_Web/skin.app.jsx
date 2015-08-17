
require("./component.jsx")['for'](module, {

	getTemplates: function (Context) {
		return {
			"menu_signup": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/menu-signup.cjs.jsx"),
				markup: function (element) {

					$('[data-component-elm="signupButton"]', element).click(function () {

						var email = $('[data-component-elm="email"]', element).val();
						var phone = $('[data-component-elm="phone"]', element).val();
						if (email || phone) {

				    		Context.subscribeWithEmail(email, phone);

				    		element.addClass("hidden");
						}

						return false;
					});

				},
				fill: function (element, data, Context) {

					var consumerGroupSubscription = Context.consumerGroupSubscription;
					if (consumerGroupSubscription) {

						// If we have a subscription we hide the form completely.
						element.addClass("hidden");
//						this.fillElements(element, {
//							email: consumerGroupSubscription.get("subscribeEmail")
//						});
					}
				}
			}),
			"feedback": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/feedback.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {
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

						Context.appContext.get('stores').cart.addItem(self.getData().item_id, {}).then(function () {
							$('[data-dismiss="modal"]').click();
							Context.forceUpdate();
						});
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

					if (Context.selectedEvent) {
						self.fillProperties(element, {
							"restaurantTitle": Context.vendorTitlesForEvents[Context.selectedEvent.get("id")] || ""
						});
					}

					self.renderSection("items", items.map(function(item) {
						return {
							"id": item.get('id'),
							"item_id": item.get('item_id'),
							"photoUrl": item.get("item.photo_url") + "/convert?w=400&h=195&fit=crop",
							"modalPhotoUrl": item.get("item.photo_url") + "/convert?w=430&h=400&fit=crop",
							"title": item.get("item.title"),
							"price": item.get("item.format.price"),
							"description": item.get("item.description"),
							"tags": item.get("item.tags"),
							"quantity": item.get("cartQuantity")
						};
					}), function getView (data) {
						return 'default';
				    }, function hookEvents(elm, data) {

				    	if (data.quantity > 0) {
				    		elm.addClass("is-in-cart");
				    	} else {
				    		elm.removeClass("is-in-cart");
				    	}

						$('[data-component-elm="showDetailsLink"]', elm).click(function () {
							Context.templates.popup.fill(data);
						});


						$('[data-component-elm="removeButton"]', elm).click(function () {
							Context.appContext.get('stores').cart.removeItem(data.item_id).then(function () {
								Context.forceUpdate();
							});
							return false;
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

							Context.appContext.get('stores').cart.addItem(data.item_id, options).then(function () {
								Context.forceUpdate();
							});
							return false;
						});

						if (
							Context.appContext.get("forceAllowOrder") ||
							(
								Context.selectedEvent &&
								Context.selectedEvent.get("day_id") === Context.appContext.get('todayId') &&
								parseInt(Context.selectedEvent.get("format.orderTimerSeconds") || 0)
							)
						) {
							self.showViews(elm, [
								"orderable"
							]);
						} else {
							self.showViews(elm, []);
						}

/*
						var tags = [];
						try {
							if (data.tags) tags = JSON.parse(data.tags);
						} catch (err) {}

						if (tags.length > 0) {
							self.renderSection("diet-tags", tags.map(function(tag) {
								if (tag === "glutenFree") tag = "gluten-free";
								return {
									"tag": tag
								};
							}), function getView (data) {
								return 'default';
							}, function hookEvents(elm, data) {
								elm.removeClass("diet-tag-spicy");
								elm.addClass("diet-tag-" + data.tag);

							});
						} else {
							$('.diet-tag', elm).hide();
						}
*/						
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
						<Context.templates.feedback.comp />
					</div>
				);

			} else {

				Panel = (
					<div>
						<Context.templates.popup.comp />
						<Context.templates.menu.comp />
						<Context.templates.menu_signup.comp />
						<Context.templates.feedback.comp />
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


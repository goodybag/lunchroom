
var console = require("../../app/lib/console");

require("./component.jsx")['for'](module, {


	mapData: function (Context, data) {
		return {
			'event_id': data.connect("page/loaded/selectedEvent/id"),
			'canOrder': data.connect("page/loaded/selectedEvent/canOrder"),
			'isPastDeadline': data.connect("page/loaded/selectedEvent/isPastDeadline"),
			'orderBy': data.connect("page/loaded/selectedEvent/format.orderByTime"),
			'goodybagFee': data.connect("page/loaded/selectedEvent/format.goodybagFee"),
			'restaurantTitle': data.connect("page/loaded/selectedEvent/vendor/title"),
			'items': data.connect("page/loaded/selectedEventItems", function (data) {
				return {
					"id": data.connect("id"),
					"event_id": data.connect("event_id"),
					"item_id": data.connect("item_id/id"),
					"photoUrl": data.connect("item_id/photo_url", {
						suffix: "/convert?w=400&h=195&fit=crop"
					}),
					"modalPhotoUrl": data.connect("item_id/photo_url", {
						suffix: "/convert?w=430&h=400&fit=crop"
					}),
					"title": data.connect("item_id/title"),
					"price": data.connect("item_id/format.price"),
					"description": data.connect("item_id/description"),
					"tags": data.connect("item_id/tags"),
					"quantity": data.connect("cartQuantity")
				};
			})
		};
	},


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
						"orderBy": data.orderBy
					});
				}
			}),
			"order_in_advance": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/order-in-advance.cjs.jsx"),
				markup: function (element) {
				},
				fill: function (element, data, Context) {
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
				markup: function (element, data) {
					var self = this;

					self.liftSections(element);

					$('[data-component-elm="addButton"]', element).click(function () {
						Context.appContext.get('stores').cart.addItemForEvent(
							self.data.itemData.event_id,
							self.data.itemData.item_id,
							{}
						).then(function () {
							$('[data-dismiss="modal"]').click();
							Context.forceUpdate();
						});
						return false;
					});
				},
				fill: function (element, data, Context) {

					data = data || {};
					data.itemData = data.itemData || {};
					data.menuData = data.menuData || {};

					this.fillProperties(element, data.itemData)

					if (data.menuData.canOrder) {
						this.showViews(element, [
							"orderable"
						]);
					} else {
						this.showViews(element, []);
					}

					var tags = [];
					try {
						if (data.itemData.tags) tags = JSON.parse(data.itemData.tags);
					} catch (err) {}

					this.renderSection(element, "diet-tags", tags.map(function(tag) {
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
				}
			}),
			"menu": new Context.Template({
				impl: require("../../www/lunchroom-landing~0/components/AppMenu/menu.cjs.jsx"),
				markup: function (element) {
					this.liftSections(element);
				},
				fill: function (element, menuData, Context) {
					var self = this;

					self.fillProperties(element, {
						"restaurantTitle": menuData.restaurantTitle,
						"goodybagFee": menuData.goodybagFee
					});

					self.renderSection(element, "items", menuData.items, function getView (data) {
						return 'default';
				    }, function hookEvents(elm, itemData) {

				    	if (itemData.quantity > 0) {
				    		elm.addClass("is-in-cart");
				    	} else {
				    		elm.removeClass("is-in-cart");
				    	}

						$('[data-component-elm="showDetailsLink"]', elm).click(function () {
							Context.templates.popup.fill({
								menuData: menuData,
								itemData: itemData
							});
						});


						$('[data-component-elm="removeButton"]', elm).click(function () {

							Context.appContext.get('stores').cart.removeItemForEvent(
								menuData.event_id,
								itemData.item_id
							).then(function () {
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

							Context.appContext.get('stores').cart.addItemForEvent(
								menuData.event_id,
								itemData.item_id,
								options
							).then(function () {
								Context.forceUpdate();
							});
							return false;
						});

						if (menuData.canOrder) {
							self.showViews(elm, [
								"orderable"
							]);
						} else {
							self.showViews(elm, []);
						}


						var tags = [];
						try {
							if (itemData.tags) tags = JSON.parse(itemData.tags);
						} catch (err) {}

						self.renderSection(elm, "diet-tags", tags.map(function(tag) {
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
				    });
				}
			})
		};
	},

	getHTML: function (Context, data) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		var Panel = "";

		if (data.items) {

			if (data.isPastDeadline) {

				Panel = (
					<div>
						<Context.templates.too_late.comp />
						<Context.templates.order_in_advance.comp />
						<Context.templates.popup.comp />
						<Context.templates.menu.comp />
						<Context.templates.menu_signup.comp />
						<Context.templates.feedback.comp />
					</div>
				);

			} else
			if (data.canOrder) {

				Panel = (
					<div>
						<Context.templates.order_in_advance.comp />
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


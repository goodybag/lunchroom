
exports['for'] = function (Component) {

	var index = 0;
	function getNextRandomKey () {
		index++;
		return "key-" + index;
	}

	var Template = function (options) {
		var self = this;
		var Context = Component.getRenderContext();
		self.impl = options.impl(Context);

		function getTemplateDataForComponent () {
			if (!Component._template_data_consumer) {
				return null;
			}
			self.setData(Component._template_data_consumer.getData());
			return self.getData();
		}

		self.comp = Context.REACT.createClass({
			componentDidMount: function () {
				self.elm = $(this.getDOMNode());
				$('[data-component-view]', self.elm).each(function () {
					var e = $(this);
					if (typeof e.attr("data-component-section") !== "undefined") return;
//					e.hide();
					e.addClass("hidden");
				});
				if (self._markup) {
					try {
						self._markup(self.elm, getTemplateDataForComponent());
					} catch (err) {
						console.error("Error marking up component!", err.stack);
					}
				}
				if (self._fill) {
					try {
						self._fill(
							self.elm,
							getTemplateDataForComponent(),
							Component.getRenderContext()
						);
					} catch (err) {
						console.error("Error filling component!", err.stack);
					}
				}
			},
			componentDidUpdate: function () {
				self.elm = $(this.getDOMNode());			
				if (self._fill) {
					try {
						self._fill(
							self.elm,
							getTemplateDataForComponent(),
							Component.getRenderContext()
						);
					} catch (err) {
						console.error("Error filling component!", err.stack);
					}
				}
			},
			render: function () {				
				return self.impl;
			}
		});

		self.elm = null;

		self._markup = options.markup || null;
		self._fill = options.fill || null;
		self.sections = {};

		self.data = null;
	}

	Template.prototype.setData = function (data) {
		if (!this.data) this.data = {};
		// NOTE: We update the properties so that anyone who has a reference gets updates as well
		for (var name in data) {
			this.data[name] = data[name];
		}
		// TODO: Remove properties that no longer exist
	}

	Template.prototype.getData = function () {
		if (this.data === null) {
			throw new Error("No data vailable. You must wait with calling 'getData()' until after the first 'fill'. i.e. do not use in the 'markup()' turn.");
		}
		return this.data;
	}

	Template.prototype.fill = function (data, element) {
		var self = this;
		if (!element) {
			element = self.elm;
		}
		self.data = data;
//		self.fillProperties(element, data);
		if (self._fill) {
			var Context = Component.getRenderContext();
			try {
				self._fill(element, data, Context);
			} catch (err) {
				console.error("Error filling component!", err.stack);
			}
		}
	}

	// TODO: Make 'element' optional and default to 'this.elm'?
	// TODO: Add support for filling 'input' fields.
	// TODO: Move to 'Template.prototype.fill'
	Template.prototype.fillProperties = function (element, data) {
		var self = this;
		var Context = Component.getRenderContext();

		$('[data-component-prop]', element).each(function () {
			var propertyElement = $(this);
			var propertyName = propertyElement.attr("data-component-prop");
			if (typeof data[propertyName] === "undefined") {
//				console.warn("Property '" + propertyName + "' not set for component: " + Context._implName);
				data[propertyName] = "?";
			}

			var target = propertyElement.attr("data-component-prop-target") || "html";

			if (target === "html") {
				propertyElement.html(data[propertyName]);
			} else {
				var targetParts = target.split("/");
				if (targetParts.length === 1) {
					propertyElement.attr(targetParts[0], data[propertyName]);
				} else
				if (targetParts.length === 2 && targetParts[0] === "style") {
					if (
						targetParts[1] === "background-image" ||
						/^https?:\/\//.test(data[propertyName])
					) {
						propertyElement.css(targetParts[1], "url('" + data[propertyName] + "')");
					} else {
						propertyElement.css(targetParts[1], data[propertyName]);
					}
				} else {
					throw new Error("Unsupported target '" + target + "'");
				}
			}
		});
	}

	// TODO: Make 'element' optional and default to 'this.elm'?
	// TODO: Move filling 'input' fields to 'Template.prototype.fillProperties'.
	Template.prototype.fillElements = function (element, data) {
		var self = this;
		var Context = Component.getRenderContext();

		$('[data-component-elm]', element).each(function () {
			var propertyElement = $(this);
			var propertyName = propertyElement.attr("data-component-elm");
			if (typeof data[propertyName] === "undefined") {
				return;
			}
 
			if (propertyElement.prop("tagName") === "INPUT") {
				propertyElement.val(data[propertyName]);
/*
// NOTE: Use 'component:prop="photo" component:prop-target="src"' instead
			} else
			if (
				propertyElement.prop("tagName") === "IMG" &&
				typeof propertyElement.attr("src") !== "undefined"
			) {
				propertyElement.attr("src", data[propertyName]);
*/
			}
		});
	}

	// TODO: Make 'element' optional and default to 'this.elm'?
	Template.prototype.showViews = function (element, views) {
		$('[data-component-view]', element).each(function () {
			var e = $(this);
			if (typeof e.attr("data-component-section") !== "undefined") return;
//			e.hide();
			e.addClass("hidden");
		});
		views.forEach(function (view) {
//			$('[data-component-view="' + view + '"]', element).show();
			$('[data-component-view="' + view + '"]', element).removeClass("hidden");
		});
	}

	// TODO: Make 'element' optional and default to 'this.elm'?
	Template.prototype.liftSections = function (element) {
		var self = this;
		$('[data-component-section][data-component-view]', element).each(function () {
			var sectionElement = $(this);
			var sectionName = sectionElement.attr("data-component-section");
			var sectionView = sectionElement.attr("data-component-view");
			if (!self.sections[sectionName]) {
				self.sections[sectionName] = {};
			}
			sectionElement.removeAttr("key");
			sectionElement.removeAttr("data-reactid");
			self.sections[sectionName][sectionView] = sectionElement.detach();
		});
	}

	Template.prototype.renderSection = function (element, name, data, getView, hookEvents) {
		var self = this;

		var sectionContainer = $('[data-component-section="' + name + '"]', element);

		// TODO: Rather than resetting container, update changed rows only.
		sectionContainer.empty();

	    data.forEach(function (record) {

	    	var view = getView(record);

	    	if (!self.sections[name][view]) {
	    		throw new Error("View '" + view + "' for section '" + name + "' not found!");
	    	}

			var elm = self.sections[name][view].clone();
			elm.attr("key", record.key || record.id || getNextRandomKey());

			self.fillProperties(elm, record);
			self.fillElements(elm, record);

			elm = elm.appendTo(sectionContainer);

			if (hookEvents) {
				hookEvents(elm, record);
			}
	    });
	}

	return Template;
}


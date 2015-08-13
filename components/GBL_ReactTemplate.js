
exports['for'] = function (Context) {

	var Template = function (options) {
		var self = this;
		self.impl = options.impl(Context);
		self.comp = Context.REACT.createClass({
			componentDidMount: function () {
				var elm = $(this.getDOMNode());			
				if (self.markup) {
					self.markup(elm);
				}
				if (self.fill) {
					self.fill(elm, Context, Context);
				}
			},
			componentDidUpdate: function () {
				var elm = $(this.getDOMNode());			
				if (self.fill) {
					self.fill(elm, Context, Context);
				}
			},
			render: function () {				
				return self.impl;
			}
		});

		self.markup = options.markup || null;
		self.fill = options.fill || null;
		self.sections = {};
	}

	Template.prototype.fillProperties = function (element, data) {
		var self = this;

		$('[data-component-prop]', element).each(function () {
			var propertyElement = $(this);
			var propertyName = propertyElement.attr("data-component-prop");
			if (typeof data[propertyName] === "undefined") {
				console.warn("Property '" + propertyName + "' not set for component: " + Context._implName);
				data[propertyName] = "?";
			}
			propertyElement.html(data[propertyName]);
		});
	}

	Template.prototype.fillElements = function (element, data) {
		var self = this;

		$('[data-component-elm]', element).each(function () {
			var propertyElement = $(this);
			var propertyName = propertyElement.attr("data-component-elm");
			if (typeof data[propertyName] === "undefined") {
				console.warn("Property '" + propertyName + "' not set for component: " + Context._implName);
				data[propertyName] = "?";
			}
 
			if (propertyElement.prop("tagName") === "INPUT") {
				propertyElement.val(data[propertyName]);
			} else
			if (propertyElement.prop("tagName") === "IMG") {
				propertyElement.attr("src", data[propertyName]);
			}
		});
	}

	Template.prototype.liftSections = function (element) {
		var self = this;
		$('[data-component-section][data-component-view]', element).each(function () {
			var sectionElement = $(this);
			var sectionName = sectionElement.attr("data-component-section");
			var sectionView = sectionElement.attr("data-component-view");
			if (!self.sections[sectionName]) {
				self.sections[sectionName] = {};
			}
			self.sections[sectionName][sectionView] = sectionElement.detach();
		});
	}

	Template.prototype.renderSection = function (name, data, getView, hookEvents) {
		var self = this;

		var sectionContainer = $('[data-component-section="' + name + '"]');

		// TODO: Rather than resetting container, update changed rows only.
		sectionContainer.html("");

	    data.forEach(function (record) {

	    	var view = getView(record);

	    	if (!self.sections[name][view]) {
	    		throw new Error("View '" + view + "' for section '" + name + "' not found!");
	    	}

			var elm = self.sections[name][view].clone();
			elm.attr("key", record.key || record.id);
console.log("ELEMENT KEY", elm.attr("key"));

			self.fillProperties(elm, record);

			if (hookEvents) {
				hookEvents(elm, record);
			}

			elm.appendTo(sectionContainer);
	    });
	}

	return Template;
}




var API = exports.API = {
	UNDERSCORE: require("underscore"),
	REACT: require("react"),
	EXTEND: require("extend"),
	MOMENT: require("moment"),
	NUMERAL: require("numeral"),
	Q: require("q"),
	GBL_TEMPLATE: require('./GBL_ReactTemplate')
};



function callOnceForId (id, handler) {
	var S = callOnceForId;
	if (!S.ids) S.ids = {};
	if (S[id]) return S[id];
	return (S[id] = (handler() || true));
}


exports.create = function (Context, implementation) {

	var singletons = {};

	function afterRender (component) {

		var ensureForNodesIndex = 0;

		var afterRender = implementation.afterRender || Context.afterRender || null;

		var ctx = API.EXTEND(false, {

			singleton: function (name) {
				if (!singletons[name]) {
					singletons[name] = {};
				}
				return singletons[name];
			},

			// Register each handler on each node only once.
			ensureForNodes: function (jQueryNodes, event, handler) {

				ensureForNodesIndex += 1;

				jQueryNodes.each(function () {
					var jQueryNode = $(this);

					var eventName = event;
			    	if (/\(\)$/.test(event)) {
			    		eventName = event.replace(/\(\)$/, "");
			    	}

					// TODO: Namespace these attribute flags more precicely.
			    	if (jQueryNode.attr("_dyn_evt_" + ensureForNodesIndex + "_" + eventName)) return;
			    	jQueryNode.attr("_dyn_evt_" + ensureForNodesIndex + "_" + eventName, "1");

			    	// If brackets we should use function instead if registering event.
			    	// e.g. 'submit()'
			    	if (/\(\)$/.test(event)) {
			    		if (handler) {
					    	jQueryNode[eventName].call(jQueryNode, handler);
			    		} else {
					    	jQueryNode[eventName].call(jQueryNode);
			    		}
			    	} else {
				    	jQueryNode.on(event, handler);
			    	}
				});
			}
		}, component._render_Context);

		var element = $(component.getDOMNode());

		function universalMarkup (element) {

			ctx.ensureForNodes(
		    	$('.button[data-link], a[data-link]', element),
		    	'click',
		    	function () {
		    		var link = $(this).attr("data-link");
		    		if (!/^#/.test(link)) return;
					component._render_Context.appContext.set('selectedView', link.replace(/^#/, ""));
		    	}
		    );
		}

		universalMarkup(element);


		if (!afterRender) return;
		afterRender.call(component, ctx, element);
	}


	function callTemplate (component, method) {
		// New template-based logic.

		try {

			function getData () {
				if (!component._template_data_consumer) return null;
				if (!component._render_Context._template) return null;
				data = component._template_data_consumer.getData();
				component._render_Context._template.setData(data);
				return component._render_Context._template.getData();
			}

			if (method === "markup") {

//console.log("MARKUP", implementation);

				if (typeof Context.mapData === "function") {

					var consumer = new (component._render_Context.appContext.get("data").Consumer)();

					consumer.mapData(Context.mapData(component._render_Context, consumer));

					component._template_data_consumer = consumer;

//console.log("MARKUP CONSUMER", implementation);

					consumer.on("change", function () {

//console.info("CONSUMER RESOLVED DATA CHANGED BASED on changed event from consumer (template)");


					});
				}

				// Called once per mount.
				if (
					component._render_Context._template &&
					component._render_Context._template["_" + method]
				) {
					component._render_Context._template["_" + method](
						$(component.getDOMNode()),
						getData()
					);
				}

			} else
			if (method === "fill") {
				// Called multiple times per mount.

//console.log("FILL", implementation);

				if (
					component._render_Context._template &&
					component._render_Context._template["_" + method]
				) {

					var data = null;

					if (component._template_data_consumer) {
//	console.log("LOAD VIA CONSUMER", implementation);

						data = getData();

					} else
					if (implementation.getTemplateData || Context.getTemplateData) {

						console.error("DEPRECATED getTemplateData for:", implementation);

						data = (implementation.getTemplateData || Context.getTemplateData).call(component, component._render_Context);
					}

					component._render_Context._template["_" + method](
						$(component.getDOMNode()),
						data,
						component._render_Context
					);
				}
			}
		} catch (err) {
			console.error("ERROR calling template", err.stack);
			throw err;
		}
	}


	var def = {

	    displayName:
	    	implementation.appContextView ||
	    	implementation.segmentName ||
	    	implementation.displayName ||
	    	'GBL_ReactComponent',

	    _trigger_forceUpdate: function () {
	    	var self = this;
	    	var self = this;
	    	if (!self._debounced_trigger_forceUpdate) {
	    		self._debounced_trigger_forceUpdate = API.UNDERSCORE.debounce(function () {
//console.log("actual forced updated");
	    			self.forceUpdate();
	    		}, 300);
	    	}
//console.log("triggered forced updated");
	    	self._debounced_trigger_forceUpdate();
	    },
		componentDidMount: function () {
			this.props.appContext.on("change", this._trigger_forceUpdate);
			if (implementation.onMount) {
				implementation.onMount.call(this);
			}

			// New template-based logic.
			callTemplate(this, "markup");
			callTemplate(this, "fill");

			afterRender(this);
	    },
	    componentDidUpdate: function () {
			callTemplate(this, "fill");
			afterRender(this);
	    },
	    componentWillUnmount: function () {
			if (implementation.onUnmount) {
				implementation.onUnmount.call(this);
			}
			this.props.appContext.off("change", this._trigger_forceUpdate);

			if (this._template_data_consumer) {
				this._template_data_consumer.destroy();
			}
	    },

	    modelRecordsWithStore: function (store, records) {

	        var _notify_onChange = API.UNDERSCORE.debounce(this._trigger_forceUpdate, 100);

	        store.once("sync", _notify_onChange);

	        return store.modelRecords(records, true).map(function(item) {

                // Re-draw ourselves on item model changes.
                item.once("change", _notify_onChange);

                return item;
            });
	    },

		getRenderContext: function () {
			return this._render_Context;
		},

	    render: function () {
	    	var self = this;

			// TODO: Remove this once we can inject 'React' automatically at build time.
			var React = API.REACT;

			var implName = def.displayName;

	    	if (implementation.appContextView) {
	    		if (self.props.appContext.get('selectedView') !== implementation.appContextView) {
	    			console.log("Cancel render of view '" + implementation.appContextView + "' because it is not the selecetd view '" + self.props.appContext.get('selectedView') + "'");
	    			return (
	    				<div/>
	    			);
	    		}
//		    	console.info("Render component: " + implName);
	    	} else {
//		    	console.info("Render component: " + implName);
	    	}

	    	self._render_Context = implementation.render.call(self);

	    	self._render_Context.forceUpdate = function () {
	    		self._trigger_forceUpdate();
	    	}

	    	self._render_Context._implName = implName;

	    	self._render_Context.Template = API.GBL_TEMPLATE.for(self);

	    	self._render_Context.MOMENT = API.MOMENT;
	    	self._render_Context.NUMERAL = API.NUMERAL;
	    	self._render_Context.REACT = API.REACT;
	    	self._render_Context.Q = API.Q;
	    	self._render_Context.appContext = self.props.appContext;


	    	// Setup sub-components for the page.
    		self._render_Context.components = {};
	    	var components = self.props.appContext.get('view').components;
	    	if (components) {
	    		Object.keys(components).forEach(function (name) {
					try {
						self._render_Context.components[name] = React.createElement(
			        		components[name],
			        		{
			        			appContext: self.props.appContext
			        		}
			        	);
			        } catch (err) {
			        	console.error("Error creating react element for component '" + name + "' from class:", components[name]);
			        }
	    		});
	    	}


	    	// New sub-template logic.
	    	if (implementation.singleton || Context.singleton) {
	    		callOnceForId(self._render_Context._implName, function () {
		    		(
			        	implementation.singleton ||
			        	Context.singleton
			        ).call(self, self._render_Context);

	    		});
	    	}

	    	if (implementation.getTemplates || Context.getTemplates) {

//console.log("GET TENMPLATEs0", Context, implementation);

	    		if (!self._templateInstances) {
					self._templateInstances = (
			        	implementation.getTemplates ||
			        	Context.getTemplates
			        ).call(self, self._render_Context);

//console.log("GET TENMPLATEs1", Context);
//console.log("GET TENMPLATEs2", implementation);

					if (typeof Context.mapData === "function") {

						var consumer = new (self._render_Context.appContext.get("data").Consumer)();

						consumer.mapData(Context.mapData(self._render_Context, consumer));

						self._template_data_consumer = consumer;

	//console.log("MARKUP CONSUMER", implementation);

						consumer.on("change", function () {

//	console.info("CONSUMER RESOLVED DATA CHANGED BASED on changed event from consumer (templates)");


						});
					}
			    }

		        self._render_Context.templates = self._templateInstances;
	    	}


	    	if (implementation.getHTML || Context.getHTML) {

	    		var data = {};
	    		if (self._template_data_consumer) {
	    			data = self._template_data_consumer.getData();
	    		}

		        var tags = (
		        	implementation.getHTML ||
		        	Context.getHTML
		        ).call(self, self._render_Context, data);

		    	console.info("Hand off to react: " + implName);

		        return tags;
		    } else
	    	if (implementation.getTemplate || Context.getTemplate) {

	    		if (!self._templateInstance) {

					self._templateInstance = (
			        	implementation.getTemplate ||
			        	Context.getTemplate
			        ).call(self, self._render_Context);
			    }

		        self._render_Context._template = self._templateInstance;

		    	console.info("Hand off to react template: " + implName);

		        return self._render_Context._template.impl;
	    	} else {
	    		throw new Error("No template source declared!");
	    	}
	    }
	};

	if (implementation.methods) {
		Object.keys(implementation.methods).forEach(function (name) {
			if (typeof def[name] !== "undefined") {
				throw new Error("Component definition already declares method '" + name + "'!");
			}
			def[name] = implementation.methods[name];
		});
	}

	var inst = API.REACT.createClass(def);

	return inst;
}


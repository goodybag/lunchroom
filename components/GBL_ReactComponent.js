

const API = exports.API = {
	UNDERSCORE: require("underscore"),
	REACT: require("react"),
	EXTEND: require("extend"),
	MOMENT: require("moment")
};


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
					component._render_Context.appContext.selectedView = link.replace(/^#/, "");
		    	}
		    );
		}

		universalMarkup(element);

		if (!afterRender) return;
		afterRender.call(component, ctx, element);
	}

	var def = {

	    displayName: implementation.displayName || 'GBL_ReactComponent',

	    _trigger_forceUpdate: function () {
	    	var self = this;
	    	var self = this;
	    	if (!self._debounced_trigger_forceUpdate) {
	    		self._debounced_trigger_forceUpdate = API.UNDERSCORE.debounce(function () {
console.log("actual forced updated");
	    			self.forceUpdate();
	    		}, 300);
	    	}
console.log("triggered forced updated");
	    	self._debounced_trigger_forceUpdate();
	    },
		componentDidMount: function () {
			this.props.appContext.on("change", this._trigger_forceUpdate);
			if (implementation.onMount) {
				implementation.onMount.call(this);
			}
			afterRender(this);
	    },
	    componentDidUpdate: function () {
			afterRender(this);
	    },
	    componentWillUnmount: function () {
			if (implementation.onUnmount) {
				implementation.onUnmount.call(this);
			}
			this.props.appContext.off("change", this._trigger_forceUpdate);
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


	    render: function () {

			// TODO: Remove this once we can inject 'React' automatically at build time.
			const React = API.REACT;

	    	if (implementation.appContextView) {
	    		if (this.props.appContext.selectedView !== implementation.appContextView) {
	    			console.log("Cancel render of view '" + implementation.appContextView + "' because it is not the selecetd view '" + this.props.appContext.selectedView + "'");
	    			return (
	    				<div/>
	    			);
	    		}

		    	console.info("Render component:", implementation.appContextView);
	    	} else {
		    	console.info("Render component:", implementation);
	    	}

	    	this._render_Context = implementation.render.call(this);

	    	this._render_Context.REACT = API.REACT;
	    	this._render_Context.appContext = this.props.appContext;

	        var tags = (
	        	implementation.getHTML ||
	        	Context.getHTML
	        ).call(this, this._render_Context);

	    	if (implementation.appContextView) {	    		
//		    	console.info("Render component:", implementation.appContextView, "tags", tags);
	    	} else {
//		    	console.info("Render component:", implementation, "tags", tags);
	    	}

	        return tags;
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


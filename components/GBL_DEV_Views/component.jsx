/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, context) {

	// ##################################################
	// # Load and configure libraries
	// ##################################################

	var React = require('react');


	// TODO: Get base path via config.
	var MOCKUPS_SUBPATH = "/components/GBL_DEV_Views/mockups";


	// ##################################################
	// # Export own component and instanciate sub-components
	// ##################################################


	var ViewLink = React.createClass({
		render: function() {
		    var self = this;
			return context.getViewTabHTML.call(self, {
				label: self.props.data.label,
				onClick: function() {
					self.props.appContext.set('selectedView', self.props.data.alias);
			    }
			});
		}
	});

	module.exports = React.createClass({

	    displayName: 'GBL_DEV_Views',


	    _trigger_syncLayout: function () {
			var iframe = $("iframe", this.getDOMNode());
			var height = iframe.parentsUntil(".ui.basic.segment > .grid", ".thirteen.wide.column").height();
			iframe.css("width", "100%");
			iframe.css("height", height + "px");
	    },

	    _trigger_forceUpdate: function (payload) {
			this.forceUpdate();
	    },

	    _window_resize_handler: function () {
	    	var self = this;
	    	if (!self._on_window_resize) {
	    		self._on_window_resize = COMPONENT.API.UNDERSCORE.debounce(function () {
	    			self._trigger_syncLayout();
	    		}, 300);
	    	}
	    	self._on_window_resize();
	    },

		componentDidMount: function () {
			this.props.appContext.on("change", this._trigger_forceUpdate);

			$(window).on("resize", this._window_resize_handler);

			this._trigger_syncLayout();
	    },
		componentDidUpdate: function () {
			var self = this;
			self._trigger_syncLayout();
			setTimeout(function () {
				self._trigger_syncLayout();
			}, 500);
	    },
	    componentWillUnmount: function () {

			$(window).off("resize", this._window_resize_handler);

			this.props.appContext.off("change", this._trigger_forceUpdate);
	    },

	    render: function() {
	    	var self = this;

	    	var views = self.props.appContext.get('views');

	    	var selectedViewAlias = self.props.appContext.get('selectedView');

			console.info("Start Render View: " + selectedViewAlias);

			if (!selectedViewAlias) {
				return (
					<div>No view selected</div>
				);
			}

	    	var viewInfo = views[selectedViewAlias] || null;
	    	var ViewMockup = null;
	    	if (viewInfo) {
	    		ViewMockup = <img className="ui centered image" src={MOCKUPS_SUBPATH + "/GBL_View_" + selectedViewAlias + ".png"}/>;
	    	}

	    	var ViewComponent = (viewInfo && viewInfo.component) || null;

	    	var isTopFrame = (window.self === window.top);
	    	if (/\?iframe=true/.test(window.location.hash)) {
	    		isTopFrame = false;
	    	}

	    	if (
	    		viewInfo &&
	    		viewInfo.container === "iframe" &&
	    		isTopFrame &&
	    		!self.props.appContext.get('context').type
	    	) {
	    		ViewComponent = React.createClass({
				    render: function () {
						var url = window.location.origin + window.location.pathname + "#" + this.props.appContext.get('selectedView');
				    	return <iframe src={url}></iframe>
				    }
	    		});
	    	}

	        return context.getHTML.call(self, {
	        	REACT: COMPONENT.API.REACT,
	        	ViewLink: ViewLink,
	        	ViewComponent: ViewComponent,
	        	ViewMockup: ViewMockup,
	        	appContext: self.props.appContext,
	        	views: views,
	        	group: (views[selectedViewAlias] && views[selectedViewAlias].group) || null,
	        	isTopFrame: isTopFrame
	        });
	    }
	});

}

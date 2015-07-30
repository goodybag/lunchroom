/** @jsx React.DOM */
'use strict'

exports.for = function (module, context) {

	// ##################################################
	// # Load and configure libraries
	// ##################################################

	const React = require('react');


	// TODO: Get base path via config.
	const MOCKUPS_SUBPATH = "/components/GBL_DEV_Views/mockups";


	// ##################################################
	// # Export own component and instanciate sub-components
	// ##################################################


	var ViewLink = React.createClass({
		render: function() {
		    var self = this;
			return context.getViewTabHTML.call(self, {
				label: self.props.data.label,
				onClick: function() {
					self.props.appContext.selectedView = self.props.data.alias;
			    }
			});
		}
	});

	module.exports = React.createClass({

	    displayName: 'GBL_DEV_Views',

	    _trigger_afterRender: function () {

			var iframe = $("iframe", this.getDOMNode());

			var height = iframe.parentsUntil(".ui.basic.segment > .grid", ".thirteen.wide.column").height();

			iframe.css("width", "100%");
			iframe.css("height", height + "px");
	    },

	    _trigger_forceUpdate: function (payload) {
			this.forceUpdate();
	    },
		componentDidMount: function () {
			this.props.appContext.on("change", this._trigger_forceUpdate);
			this._trigger_afterRender();
	    },
		componentDidUpdate: function () {
			this._trigger_afterRender();
	    },
	    componentWillUnmount: function () {
			this.props.appContext.off("change", this._trigger_forceUpdate);
	    },

	    render: function() {
	    	var self = this;

	    	var views = self.props.appContext.views;

	    	var selectedViewAlias = self.props.appContext.selectedView;

			console.info("Start Render View: " + selectedViewAlias);

	    	var viewInfo = views[selectedViewAlias] || null;
	    	var ViewMockup = null;
	    	if (viewInfo) {
	    		ViewMockup = <img className="ui centered image" src={MOCKUPS_SUBPATH + "/GBL_View_" + selectedViewAlias + ".png"}/>;
	    	}

	    	var ViewComponent = (viewInfo && viewInfo.component) || null;

	    	var isTopFrame = (window.self === window.top);

	    	if (
	    		viewInfo &&
	    		viewInfo.container === "iframe" &&
	    		isTopFrame &&
	    		!self.props.appContext.context.type
	    	) {
	    		ViewComponent = React.createClass({
				    render: function () {
						var url = window.location.origin + window.location.pathname + "#" + this.props.appContext.selectedView;
				    	return <iframe src={url}></iframe>
				    }
	    		});
	    	}

	        return context.getHTML.call(self, {
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

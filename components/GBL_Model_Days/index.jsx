/** @jsx React.DOM */
'use strict'

var React = require('react')

module.exports = React.createClass({


    _on_sync: function () {
		this.forceUpdate();
    },
	componentDidMount: function () {
		this.props.appContext.get('stores').days.on("updated", this._on_sync);
    },
    componentWillUnmount: function () {
		this.props.appContext.get('stores').days.off("updated", this._on_sync);
    },


    render: function() {
    	var self = this;

        var days = self.props.appContext.get('stores').days;

        return (
          <div>
          	<h1>Events</h1>
            <ul>
	            {days.modelRecords(days.where()).map(function(item) {
					return (
						<li key={item.get('id')}>
							<h3>{item.get("format.ddd")}</h3>
						</li>
					);
		        })}
            </ul>
          </div>
        );
    }
});

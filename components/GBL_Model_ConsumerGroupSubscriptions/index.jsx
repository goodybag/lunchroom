/** @jsx React.DOM */
'use strict'

var React = require('react')

module.exports = React.createClass({


    _on_sync: function () {
		this.forceUpdate();
    },
	componentDidMount: function () {
		this.props.appContext.get('stores').consumerGroupSubscriptions.on("sync", this._on_sync);
    },
    componentWillUnmount: function () {
		this.props.appContext.get('stores').consumerGroupSubscriptions.off("sync", this._on_sync);
    },


    render: function() {
    	var self = this;
        return (
          <div>
          	<h1>Items</h1>
            <ul>
	            {self.props.appContext.get('stores').consumerGroupSubscriptions.where().map(function(item) {
					return (
						<li key={item.id}>
							{item.get("token")}
						</li>
					);
		        })}
            </ul>
          </div>
        );
    }
});

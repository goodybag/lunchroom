/** @jsx React.DOM */
'use strict'

var React = require('react')

module.exports = React.createClass({


    _on_sync: function () {
		this.forceUpdate();
    },
	componentDidMount: function () {
		this.props.appContext.get('stores').orders.on("sync", this._on_sync);
    },
    componentWillUnmount: function () {
		this.props.appContext.get('stores').orders.off("sync", this._on_sync);
    },


    render: function() {
    	var self = this;
        return (
          <div>
          	<h1>Items</h1>
            <ul>
	            {self.props.appContext.get('stores').orders.where().map(function(item) {
					return (
						<li key={item.id}>
							<h3>{item.get("day_id")}</h3>
                            <pre>
                                {JSON.stringify(item.get("form"), null, 4)}
                            </pre>
                            <pre>
                                {JSON.stringify(item.get("items"), null, 4)}
                            </pre>
						</li>
					);
		        })}
            </ul>
          </div>
        );
    }
});

/** @jsx React.DOM */
'use strict'

const UNDERSCORE = require("underscore");
var React = require('react')

module.exports = React.createClass({


    _on_sync: function () {
		this.forceUpdate();
    },
	componentDidMount: function () {
		this.props.appContext.stores.cart.on("sync", this._on_sync);
    },
    componentWillUnmount: function () {
		this.props.appContext.stores.cart.off("sync", this._on_sync);
    },


    render: function() {
    	var self = this;

        var cart = self.props.appContext.stores.cart;

        var _notify_onChange = UNDERSCORE.debounce(self._trigger_forceUpdate, 100);

        var items = cart.modelRecords(cart.where()).map(function(item) {

            // Re-draw ourselves on item model changes.
            item.once("change", _notify_onChange);

            return item;
        });

        return (
          <div>
          	<h1>Items</h1>
            <ul>
	            {items.map(function(item) {
					return (
						<li key={item.get("id")}>
                            {item.get("title")} - Quantity: {item.get("quantity")}
							<img className="ui centered image" src={item.get("photo_url")} height="70"/>
						</li>
					);
		        })}
            </ul>
          </div>
        );
    }
});

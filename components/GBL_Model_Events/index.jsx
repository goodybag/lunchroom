/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({

    getHTML: function (Context) {

        var React = Context.REACT;

        return (
          <div>
            <h1>Events</h1>
            <ul>
                {Context.events.map(function(item) {
                    return (
                        <li key={item.id}>
                            <h3>{item.get("day_id")}</h3>
                            {item.get("format.deliveryTime")} - {item.get("consumerGroup.title")} - {item.get("consumerGroup.contact")}
                            {item.get("consumerGroup.address")}
                        </li>
                    );
                })}
            </ul>
          </div>
        );
    }

}, {

    onMount: function () {
        this.props.appContext.get('stores').events.on("sync", this._trigger_forceUpdate);
    },

    onUnmount: function () {
        this.props.appContext.get('stores').events.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
    	var self = this;

        var events = self.props.appContext.get('stores').events;

        return {
            events: self.modelRecordsWithStore(events, events.where())
        };
    }
});

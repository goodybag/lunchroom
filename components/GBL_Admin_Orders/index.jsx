/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({


    afterRender: function (Context, element) {

        Context.ensureForNodes(
            $('.button[data-link]', element),
            'click',
            function () {

                if ($(this).attr("data-link") === "action:set-status") {

                    Context.appContext.get('stores').orderStatus.setStatusForOrderHashId(
                        $(this).attr("data-id"),
                        $(this).attr("data-value")
                    );
                }
            }
        );
    },

    getHTML: function (Context) {

        var React = Context.REACT;

        return (
          <div>
            <h1>All Orders</h1>

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Code</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Vendor</th>
                    <th>Customer</th>
                    <th>Pickup Location</th>
                </tr>
              </thead>
              <tbody>

                {Context.orders.map(function(item) {

                    var Row = (
                        <tr key={item.get('id')}>
                          <td>{item.get("referenceCode3")}</td>
                          <td>{item.get("format.deliveryDate")}</td>
                          <td>{item.get("format.deliveryTime")}</td>
                          <td>{item.get("orderFrom")}</td>
                          <td>{item.get("customer")}</td>
                          <td>{item.get("pickupLocation")}</td>
                        </tr>
                    );

                    var Actions = null;
/*
                    if (item.get("status.id") !== "delivered") {
                        var key = item.get('id') + "-actions";
                        Actions = (
                            <tr key={key}>
                                <td colSpan="5">

                                    <button data-link="action:set-status" data-value="confirmed" data-id={item.get('orderHashId')} className="ui primary button">
                                        Confirmed
                                    </button>

                                    <button data-link="action:set-status" data-value="delivered" data-id={item.get('orderHashId')} className="ui primary button">
                                        Delivered
                                    </button>

                                </td>
                            </tr>
                        );
                    }
*/
                    if (Actions) {
                        return [
                            Row,
                            Actions
                        ];
                    } else {
                        return Row;
                    }
                })}

              </tbody>
            </table>
          </div>
        );
    }

}, {

    onMount: function () {
        var self = this;

        self.props.appContext.get('stores').orders.on("sync", self._trigger_forceUpdate);

        self.props.appContext.get('stores').orders.reset();
        self.props.appContext.get('stores').orders.fetch();

        // Reload every 60 seconds.
        setInterval(function () {
            self.props.appContext.get('stores').orders.reset();
            self.props.appContext.get('stores').orders.fetch();
        }, 60 * 1000);
    },

    onUnmount: function () {
        this.props.appContext.get('stores').orders.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

        var orders = self.props.appContext.get('stores').orders;

        return {
            orders: self.modelRecordsWithStore(orders, orders.where({
                day_id: this.props.appContext.get('todayId')
            }))
        };
    }
});

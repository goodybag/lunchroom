/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({

    afterRender: function (Context, element) {
        var self = this;

        Context.ensureForNodes(
            $('button[data-component-action="remove"]', element),
            'click',
            function () {

                var id = $(this).attr("data-component-value-id");

                $('.modal[data-component-alias="confirm-remove"]').modal({
                    closable: true,
                    onApprove: function() {

                        self.props.appContext.get('stores').orders.deleteOrder(id);

                    }
                }).modal('show');
            }
        );
    },

    getHTML: function (Context) {

        var React = Context.REACT;

        return (
          <div>
            <h1>All Orders</h1>

            <div className="ui basic modal" data-component-alias="confirm-remove">
              <i className="close icon"></i>
              <div className="header">
                Delete Order
              </div>
              <div className="image content">
                <div className="image">
                  <i className="archive icon"></i>
                </div>
                <div className="description">
                  <p>Are you ABSOLUTELY sure you want to delete the order?</p>
                </div>
              </div>
              <div className="actions">
                <div className="two fluid ui inverted buttons">
                  <div className="ui red basic inverted negative button">
                    <i className="remove icon"></i>
                    No
                  </div>
                  <div className="ui green basic inverted positive button">
                    <i className="checkmark icon"></i>
                    Yes
                  </div>
                </div>
              </div>
            </div>

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Code</th>
                    <th>Placed</th>
                    <th>Delivery</th>
                    <th>Vendor</th>
                    <th>Customer</th>
                    <th>Pickup Location</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                {Context.orders.map(function(item) {

                    var Row = (
                        <tr key={item.get('id')}>
                          <td>{item.get("referenceCode3")}</td>
                          <td>{item.get("format.orderPlacedDateTime")}</td>
                          <td>{item.get("format.deliveryDay")}</td>
                          <td>{item.get("orderFrom")}</td>
                          <td>{item.get("customer")}</td>
                          <td>{item.get("pickupLocation")}</td>
                          <td>
                            <button data-component-value-id={item.get('id')} data-component-action="remove" className="ui compact icon red button">
                              <i className="remove icon"></i>
                            </button>
                          </td>
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

        self.props.appContext.get('stores').orders.on("remove", self._trigger_forceUpdate);
        self.props.appContext.get('stores').orders.on("sync", self._trigger_forceUpdate);

        self.props.appContext.get('stores').orders.loadAllOrdersForToday();

        // Reload every 60 seconds.
        setInterval(function () {
            self.props.appContext.get('stores').orders.loadAllOrdersForToday();
        }, 60 * 1000);
    },

    onUnmount: function () {
        this.props.appContext.get('stores').orders.off("remove", this._trigger_forceUpdate);
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

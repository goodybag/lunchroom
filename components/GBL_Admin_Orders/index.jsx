/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({


    mapData: function (Context, data) {

      var LODASH = require("lodash");

      Context.appContext.get('stores').orderItems.loadAllPlacedToday().then(function () {
        Context.forceUpdate();
      });

      return {
        "@map": {
          'items': data.connect('order-items/*[placed_day_id="' + Context.appContext.get('todayId') + '"]', function (data) {
            return {
              "id": data.connect("id"),
              "order_id": data.connect("order_id"),
              "day_id": data.connect("day_id"),
              "day": data.connect("event_id/day.format.ddd"),
              "restaurant": data.connect("vendor_id/title"),
              "title": data.connect("title"),
              "options": data.connect("options"),
              "quantity": data.connect("quantity")
            };
          })
        }
      };
    },


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

    getHTML: function (Context, data) {

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
                    <th>Items</th>
                    <th>Customer</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                {Context.orders.map(function(order) {

                    var Row = (
                        <tr key={order.get('id')}>
                          <td>{order.get("referenceCode3")}</td>
                          <td>{order.get("format.orderPlacedDateTime")}</td>
                          <td>{order.get("format.deliveryDay")}</td>
                          <td>{order.get("items.count")}</td>
                          <td>{order.get("customer")}</td>
                          <td>
                            <button data-component-value-id={order.get('id')} data-component-action="remove" className="ui compact icon red button">
                              <i className="remove icon"></i>
                            </button>
                          </td>
                        </tr>
                    );

                    var itemsRowId = order.get('id') + "i";

                    var ItemsRow = (
                        <tr key={itemsRowId}>
                          <td colSpan="6">
                            <div className="ui celled list">
                              {data.items.filter(function (item) {
                                return (item.order_id === order.get('id'))
                              }).map(function (item) {
                                return (
                                  <div className="item">On <span className="ui blue label">{item.day}</span> <span className="ui orange label">{item.quantity}</span> <b>{item.title}</b> <span className="ui yellow label">{item.options}</span> from <span className="ui brown label">{item.restaurant}</span></div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                    );

                    return [
                        Row,
                        ItemsRow
                    ];
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

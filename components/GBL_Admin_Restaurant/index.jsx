/** @jsx React.DOM */
'use strict'

const COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({

    afterRender: function (Context, element) {
        var self = this;

        Context.ensureForNodes(
            $('.dropdown[data-fieldname="vendor_id"]', element),
            'dropdown()',
            {
                onChange: function(value, text, $selectedItem) {
                    self.selectRestaurant(value);
                }
            }
        );

        Context.ensureForNodes(
            $('.button[data-link]', element),
            'click',
            function () {

                if ($(this).attr("data-link") === "action:set-status") {

                    Context.appContext.stores.orderStatus.setStatusForOrderHashId(
                        $(this).attr("data-id"),
                        $(this).attr("data-value")
                    );
                }
            }
        );
    },

    getHTML: function (Context) {

        const React = Context.REACT;

        var externalVendorAdminLink = "";
        if (Context.activeVendor) {
            externalVendorAdminLink = window.location.origin + "/vendor-" + Context.activeVendor.get("adminAccessToken") + "/harness.htm#Admin_Restaurant";
        }

        var MasterAdmin = "";
        if (!this.props.appContext.context.type) {
            MasterAdmin = (
                <div className="ui segment">

                    <form className="ui form">

                        <div data-fieldname="vendor_id" className="ui floating dropdown labeled button">
                          <span className="text">Select Restaurant</span>
                          <div className="menu">
                            <div className="ui icon search input">
                              <i className="search icon"></i>
                              <input type="text"/>
                            </div>
                            <div className="scrolling menu">
                                {Context.vendors.map(function(item) {
                                    return (
                                        <div className="item" data-value={item.get("id")}>
                                          {item.get("title")}
                                        </div>
                                    );
                                })}
                            </div>
                          </div>
                        </div>

                        <div className="ui corner labeled input">
                          <input type="text" value={externalVendorAdminLink}/>
                          <div className="ui corner label">
                            <i className="external icon"></i>
                          </div>
                        </div>

                    </form>
                </div>
            );
        }

        return (
          <div>
            <h1>Restaurant Admin</h1>

            {MasterAdmin}

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Number</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Vendor</th>
                    <th>Status</th>
                </tr>
              </thead>
              <tbody>

                {Context.orders.map(function(item) {

                    var Row = (
                        <tr key={item.id}>
                          <td>{item.get("number")}</td>
                          <td>{item.get("format.deliveryDate")}</td>
                          <td>{item.get("format.deliveryTime")}</td>
                          <td>{item.get("orderFrom")}</td>
                          <td>{item.get("status.format")}</td>
                        </tr>
                    );

                    var key = item.id + "-items";
                    var items = item.get("items") || [];
                    var Items = (
                        <tr key={key}>
                            <td colSpan="5">
                                <table className="ui very basic table">
                                  <tbody>
                                    {items.map(function (item) {
                                        return (
                                            <tr>
                                              <td>{item.title}</td>
                                              <td>{item.options}</td>
                                              <td>{item.quantity}</td>
                                            </tr>
                                        );
                                    })}
                                  </tbody>
                                </table>
                            </td>
                        </tr>
                    );

                    var Actions = null;

                    if (item.get("status.id") !== "delivered") {
                        var key = item.id + "-actions";
                        Actions = (
                            <tr key={key}>
                                <td colSpan="5">

                                    <button data-link="action:set-status" data-value="confirmed" data-id={item.orderHashId} className="ui primary button">
                                        Confirmed
                                    </button>

                                    <button data-link="action:set-status" data-value="delivered" data-id={item.orderHashId} className="ui primary button">
                                        Delivered
                                    </button>

                                </td>
                            </tr>
                        );
                    }

                    var Rows = [
                        Row,
                        Items
                    ];

                    if (Actions) {
                        Rows.push(Actions);
                    }

                    return Rows;
                })}

              </tbody>
            </table>
          </div>
        );
    }

}, {

    methods: {

        selectRestaurant: function (id) {
            this.props.selectedRestaurant = id;
            this.fetchForActiveRestaurant();
        },

        fetchForActiveRestaurant: function () {
            if (this.props.selectedRestaurant) {
                this.props.appContext.stores.orders.loadForVendorId(this.props.selectedRestaurant);
            } else {
                this.props.appContext.stores.orders.fetch();
            }
        }
    },

    onMount: function () {
        this.props.appContext.stores.orders.on("sync", this._trigger_forceUpdate);
        this.props.appContext.stores.vendors.on("sync", this._trigger_forceUpdate);

        if (this.props.appContext.context.type === "vendor") {
            this.selectRestaurant(this.props.appContext.context.vendor_id);
        } else {
            this.fetchForActiveRestaurant();
        }

        this.props.appContext.stores.vendors.reset();
        this.props.appContext.stores.vendors.fetch();
    },

    onUnmount: function () {
        this.props.appContext.stores.orders.off("sync", this._trigger_forceUpdate);
        this.props.appContext.stores.vendors.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

        var orders = self.props.appContext.stores.orders;

        var vendors = self.props.appContext.stores.vendors;

        var activeVendor = null;
        var ordersWhere = {};

        if (this.props.selectedRestaurant) {
            activeVendor = vendors.get(this.props.selectedRestaurant);
            ordersWhere = {
                vendor_ids: ""+this.props.selectedRestaurant
            };
        }

console.log("ordersWhere", ordersWhere);

console.log("orders", orders);
console.log("orders.where(ordersWhere)", orders.where(ordersWhere));


        return {
            vendors: self.modelRecordsWithStore(vendors, vendors.where()),
            orders: self.modelRecordsWithStore(orders, orders.where(ordersWhere)),
            activeVendor: activeVendor
        };
    }
});
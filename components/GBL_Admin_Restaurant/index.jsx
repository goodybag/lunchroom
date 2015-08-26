/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({


    mapData: function (Context, data) {

        var LODASH = require("lodash");

        var todayId = Context.appContext.get('todayId');

        Context.appContext.get('stores').vendors.loadAll().then(function () {
            Context.forceUpdate();
        });

        return {
            "@query": {
                "vendor_id": function () {
                    return (
                        Context.appContext.get('context').vendor_id ||
                        Context.props.selectedRestaurant ||
                        0
                    );
                }
            },
            "@map": {
              'vendors': data.connect('vendors/*'),
              'items': data.connect('order-items/*[day_id="' + todayId + '"][vendor_id="{vendor_id}"]', function (data) {
                return {
                  "id": data.connect("id"),
                  "title": data.connect("title"),
                  "options": data.connect("options"),
                  "quantity": data.connect("quantity")
                };
              })
            },
            "@postprocess": function (data) {
                data.itemsTally = {};
                (data.items || []).forEach(function (item) {
                    var key = item.title + ":" + item.options;
                    if (!data.itemsTally[key]) {
                        data.itemsTally[key] = {
                            id: key,
                            title: item.title,
                            options: item.options,
                            quantity: parseInt(item.quantity)
                        };
                    } else {
                        data.itemsTally[key].quantity += parseInt(item.quantity);
                    }
                });
                data.itemsTally = Object.keys(data.itemsTally).map(function (id) {
                    return data.itemsTally[id];
                });
                return data;
            }
        };
    },


    afterRender: function (Context, element) {
        var self = this;

        Context.ensureForNodes(
            $('.dropdown[data-fieldname="vendor_id"]', element),
            'dropdown()',
            {
                onChange: function(value, text, $selectedItem) {

                    self.props.selectedRestaurant = value;

                    self.props.appContext.get('stores').orderItems.loadAllForVendorToday(value).then(function () {
                        self._trigger_forceUpdate();
                    });
                }
            }
        );

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

    getHTML: function (Context, data) {

        var React = Context.REACT;

        var externalVendorAdminLink = "";
//        if (Context.activeVendor) {
//            externalVendorAdminLink = window.location.origin + "/vendor-" + Context.activeVendor.get("adminAccessToken") + "#Admin_Restaurant";
//        }
//console.log("DATA", data);

/*
                          <div className="field">

                            <div className="ui corner labeled input">
                              <a href={externalVendorAdminLink} target="_blank">External link to give to Restaurant</a>
                            </div>

                          </div>
*/

        var MasterAdmin = "";
        if (!this.props.appContext.get('context').type) {
            MasterAdmin = (
                <div className="ui segment">

                    <form className="ui form">

                        <div className="fields">

                          <div className="field">

                            <div data-fieldname="vendor_id" className="ui floating dropdown labeled button">
                              <span className="text">Select Restaurant</span>
                              <div className="menu">
                                <div className="ui icon search input">
                                  <i className="search icon"></i>
                                  <input type="text"/>
                                </div>
                                <div className="scrolling menu">
                                    {(data.vendors || []).map(function(item) {
                                        return (
                                            <div className="item" data-value={item.get("id")}>
                                              {item.get("title")}
                                            </div>
                                        );
                                    })}
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>

                    </form>
                </div>
            );
        }

        var vendorTitle = (
            Context.activeVendor &&
            Context.activeVendor.get("title")
        ) || "Please select!";

//            <h1>Orders for Today for: {vendorTitle}</h1>
        return (
          <div>

            {MasterAdmin}

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Item</th>
                    <th>Options</th>
                    <th>Quantity</th>
                </tr>
              </thead>
              <tbody>

                {(data.itemsTally || []).map(function(item) {

                    return (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>{item.options}</td>
                          <td>{item.quantity}</td>
                        </tr>
                    );
                })}

              </tbody>
            </table>
          </div>
        );
    }

}, {

    methods: {
/*
        selectRestaurant: function (id) {
            var self = this;

            self.props.selectedRestaurant = id;
            Context.selectedRestaurant

//              self.props.appContext.get('stores').orderItems.loadAllForVendorToday(id).then(function () {
                self._trigger_forceUpdate();
//              });            
//            this.fetchForActiveRestaurant();
        }
*/        
/*
        fetchForActiveRestaurant: function () {
            if (this.props.selectedRestaurant) {
                this.props.appContext.get('stores').orders.loadForVendorIdAndDayId(
                    this.props.selectedRestaurant,
                    COMPONENT.API.MOMENT().format("YYYY-MM-DD")
                );
            }
        }
*/
    },

    onMount: function () {
        var self = this;

//        self.props.appContext.get('stores').orders.on("sync", self._trigger_forceUpdate);
//        self.props.appContext.get('stores').vendors.on("sync", self._trigger_forceUpdate);

//        if (self.props.appContext.get('context').type === "vendor") {
//            self.selectRestaurant(self.props.appContext.get('context').vendor_id);
//        } else {
//            self.fetchForActiveRestaurant();
//        }

//        self.props.appContext.get('stores').vendors.reset();
//        self.props.appContext.get('stores').vendors.fetch();

        // Reload every 60 seconds.
        setInterval(function () {

            if (self.props.selectedRestaurant) {
                self.props.appContext.get('stores').orderItems.loadAllForVendorToday(self.props.selectedRestaurant).then(function () {
                    self._trigger_forceUpdate();
                });
            }
//            self.props.appContext.get('stores').vendors.reset();
//            self.props.appContext.get('stores').vendors.fetch();
        }, 60 * 1000);
    },

    onUnmount: function () {
//        this.props.appContext.get('stores').orders.off("sync", this._trigger_forceUpdate);
//        this.props.appContext.get('stores').vendors.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

return {};

        var orders = self.props.appContext.get('stores').orders;

        var vendors = self.props.appContext.get('stores').vendors;

        var activeVendor = null;

        var orderRecords = [];

        var ordersWhere = {
            day_id: this.props.appContext.get('todayId')
        };

        if (this.props.appContext.get('context').type === "vendor") {

            activeVendor = vendors.get(this.props.appContext.get('context').vendor_id);

            ordersWhere.vendor_ids = ""+this.props.appContext.get('context').vendor_id;
            orderRecords = self.modelRecordsWithStore(orders, orders.where(ordersWhere));

        } else {

            if (this.props.selectedRestaurant) {
                activeVendor = vendors.get(this.props.selectedRestaurant);
                ordersWhere = {
                    vendor_ids: ""+this.props.selectedRestaurant
                };
                orderRecords = self.modelRecordsWithStore(orders, orders.where(ordersWhere));
            }
        }

        orderRecords = COMPONENT.API.UNDERSCORE.sortBy(orderRecords, function (record) {
            return record.get("time");
        });
        orderRecords.reverse();

        return {
            vendors: self.modelRecordsWithStore(vendors, vendors.where()),
            orders: orderRecords,
            activeVendor: activeVendor
        };
    }
});

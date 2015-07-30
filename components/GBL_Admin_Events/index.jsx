/** @jsx React.DOM */
'use strict'

const COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({

    afterRender: function (Context, element) {

        Context.ensureForNodes(
            $('.ui.dropdown', element),
            'dropdown()'
        );

        // Form submission
        Context.ensureForNodes(
            $('#form-create BUTTON.button.form-submit', element),
            'click',
            function () {
                var values = {};
                $('#form-create .dropdown[data-fieldname]').each(function() {
                    if (!values) return;
                    var name = $(this).attr("data-fieldname");
                    var value = $(this).dropdown('get value');
                    if (typeof value === "object") {
                        alert("You must specify the '" + name + "' field!");
                        values = null;
                        return;
                    }
                    values[name] = value;
                });
                if (!values) return false;
                Context.appContext.stores.events.createEvent(values);
                return false;
            }
        );
    },

    getHTML: function (Context) {

        const React = Context.REACT;

        return (
          <div>
            <h1>Events Admin</h1>

            <div className="ui segment">

                <form id="form-create" className="ui form">

                    <div className="ui compact menu">
                      <div className="ui label">
                        Tip
                      </div>
                        <div className="ui simple dropdown item">
                          <div className="text">5%</div>
                          <i className="dropdown icon"></i>
                          <div className="menu">
                            <div className="item">10%</div>
                            <div className="item">15%</div>
                            <div className="item">20%</div>
                          </div>
                        </div>
                    </div>

                    <div className="ui labeled input">
                      <div className="ui label">
                        Tax
                      </div>
                      <input type="text" placeholder="5%"/>
                    </div>

                    <div className="ui labeled input">
                      <div className="ui label">
                        Goodybag Fee
                      </div>
                      <input type="text" placeholder="5.00"/>
                    </div>

                    <div data-fieldname="day_id" className="ui selection dropdown">
                      <div className="default text">Day</div>
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        {Context.days.map(function(item) {
                            return <div className="item" data-value={item[0]}>{item[1]}</div>
                        })}
                      </div>
                    </div>

                    <div data-fieldname="consumer_group_id" className="ui floating dropdown labeled button">
                      <span className="text">Select Company</span>
                      <div className="menu">
                        <div className="ui icon search input">
                          <i className="search icon"></i>
                          <input type="text" placeholder="Search companies ..."/>
                        </div>
                        <div className="scrolling menu">
                            {Context.consumerGroups.map(function(item) {
                                return (
                                    <div className="item" data-value={item.get("id")}>
                                      {item.get("title")}
                                    </div>
                                );
                            })}
                        </div>
                      </div>
                    </div>

                    <div data-fieldname="vendor_id" className="ui floating dropdown labeled button">
                      <span className="text">Select Restaurant</span>
                      <div className="menu">
                        <div className="ui icon search input">
                          <i className="search icon"></i>
                          <input type="text" placeholder="Search restaurants ..."/>
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

                    <button className="ui primary small button form-submit">
                        Create Menu
                    </button>

                </form>
            </div>

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Company</th>
                    <th>Pickup</th>
                </tr>
              </thead>
              <tbody>

                {Context.events.map(function(item) {

                    var Row = (
                        <tr key={item.id}>
                          <td>{item.get("format.deliveryDate")}</td>
                          <td>{item.get("format.deliveryTime")}</td>
                          <td>{item.get("consumerGroup.title")}</td>
                          <td>{item.get("consumerGroup.pickupLocation")}</td>
                        </tr>
                    );

                    return Row;
                })}

              </tbody>
            </table>

          </div>
        );
    }

}, {

    onMount: function () {
        this.props.appContext.stores.events.on("sync", this._trigger_forceUpdate);
        this.props.appContext.stores.vendors.on("sync", this._trigger_forceUpdate);
        this.props.appContext.stores.consumerGroups.on("sync", this._trigger_forceUpdate);

        this.props.appContext.stores.events.reset();
        this.props.appContext.stores.events.fetch();

        this.props.appContext.stores.vendors.reset();
        this.props.appContext.stores.vendors.fetch();

        this.props.appContext.stores.consumerGroups.reset();
        this.props.appContext.stores.consumerGroups.fetch();
    },

    onUnmount: function () {
        this.props.appContext.stores.events.off("sync", this._trigger_forceUpdate);
        this.props.appContext.stores.vendors.off("sync", this._trigger_forceUpdate);
        this.props.appContext.stores.consumerGroups.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

        var days = [];

        for (var day=0 ; day<=4 ; day++) {
            days.push([
                COMPONENT.API.MOMENT().add(day, 'days').format("YYYY-MM-DD"),
                COMPONENT.API.MOMENT().add(day, 'days').format("dddd, MMM Do YYYY")
            ]);
        }

        var events = self.props.appContext.stores.events;

        var vendors = self.props.appContext.stores.vendors;

        var consumerGroups = self.props.appContext.stores.consumerGroups;

        return {

            days: days,

            events: self.modelRecordsWithStore(events, events.where()),

            vendors: self.modelRecordsWithStore(vendors, vendors.where()),

            consumerGroups: self.modelRecordsWithStore(consumerGroups, consumerGroups.where())
        };
    }
});

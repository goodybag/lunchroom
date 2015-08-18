/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({

    afterRender: function (Context, element) {
        var self = this;

        Context.ensureForNodes(
            $('.ui.dropdown', element),
            'dropdown()'
        );

        Context.ensureForNodes(
          $('button[data-link="action:deselectEvent"]', element),
          'click',
          function () {
              self.props.selectedEvent = null;
              if (self.props.selectedVendor) {
                self.props.appContext.get('stores').items.loadForVendor(self.props.selectedVendor).then(function () {
                  self._trigger_forceUpdate();
                });
              }
              self._trigger_forceUpdate();
              return false;
          }
        );

        Context.ensureForNodes(
          $('button[data-link="action:ready"]', element),
          'click',
          function () {
              self.props.appContext.get('stores').events.setReadyForEventId(self.props.selectedEvent).then(function () {
                self._trigger_forceUpdate();
              });
              return false;
          }
        );

        Context.ensureForNodes(
          $('button[data-link="action:delivered"]', element),
          'click',
          function () {
              self.props.appContext.get('stores').events.setDeliveredForEventId(self.props.selectedEvent).then(function () {
                self._trigger_forceUpdate();
              });
              return false;
          }
        );

        Context.ensureForNodes(
          $('button[data-link="action:delete"]', element),
          'click',
          function () {
              self.props.appContext.get('stores').events.deleteForEventId(self.props.selectedEvent).then(function () {
                self.props.selectedEvent = null;
                self._trigger_forceUpdate();
              });
              return false;
          }
        );

        Context.ensureForNodes(
          $('#form-vendor-filter [data-fieldname="vendor_id"]', element),
          'dropdown()', {
            onChange: function(value, text) {
              if (self.props.selectedVendor === value) return;
              self.props.selectedVendor = value;
              self.props.appContext.get('stores').items.loadForVendor(self.props.selectedVendor).then(function () {
                self._trigger_forceUpdate();
              });
            }
          }
        );

        Context.ensureForNodes(
          $('#form-create [data-fieldname="consumer_group_id"]', element),
          'dropdown()', {
            onChange: function(value, text) {
              if (self.props.selectedConsumerGroup === value) return;
              self.props.selectedConsumerGroup = value;
              self.props.appContext.get('stores').events.loadForConsumerGroupId(self.props.selectedConsumerGroup).then(function () {
                self._trigger_forceUpdate();
              });
            }
          }
        );

        Context.ensureForNodes(
          $('#form-create [data-fieldname="day_id"]', element),
          'pickadate()',
          {
            onSet: function(context) {
              var value = this.get('select', 'yyyy-mm-dd');
              if (self.props.selectedDay === value) return;
              self.props.selectedDay = value;
//              self.props.appContext.get('stores').events.loadForDay(self.props.selectedDay).then(function () {
//                self._trigger_forceUpdate();
//              });
            }
          }
        );

        var picker = $('#form-create [data-fieldname="day_id"]', element).pickadate('picker');
        if (picker) {
          if (self.props.selectedDay !== picker.get('select', 'yyyy-mm-dd')) {
            picker.set('select', self.props.selectedDay, {
              format: 'yyyy-mm-dd'
            });
          }
        }

        // Form submission
        Context.ensureForNodes(
            $('#form-create BUTTON.button.form-submit', element),
            'click',
            function () {

                $('#form-create').removeClass("error");

                var error = false;
                var values = {};
                $('#form-create [data-fieldname]').each(function() {

                    var elm = $(this);

                    elm.removeClass("error");

                    var name = elm.attr("data-fieldname");

                    var value = null;

                    if (elm.attr('data-fieldname') === 'day_id') {
                      value = elm.pickadate('picker').get('select', 'yyyy-mm-dd');
                    } else
                    if (elm.hasClass("dropdown")) {
                      value = elm.dropdown('get value');
                    } else {
                      value = elm.val();
                    }

                    if (typeof value === "object" || value === "") {
                        elm.addClass("error");
                        error = true;
                        return;
                    }
                    values[name] = value;
                });
                if (error) {
                  $('#form-create').addClass("error");
                } else {

                  Context.appContext.get("stores").events.setPresets(values)
                  Context.appContext.get('stores').events.createEvent(values).then(function () {

                    return self.props.appContext.get('stores').events.loadForConsumerGroupId(self.props.selectedConsumerGroup).then(function () {
                      self._trigger_forceUpdate();
                    });

                  });
                }
                return false;
            }
        );

        Context.ensureForNodes(
            $('TABLE.events-table', element),
            'click',
            function (event) {
              var value = $(event.target).parentsUntil("TBODY", "TR").attr("data-id") || null;
              if (self.props.selectedEvent === value) return;
              self.props.selectedEvent = value;
              self.props.appContext.get('stores').menus.loadForEvent(self.props.selectedEvent).then(function () {
                self._trigger_forceUpdate();
              });
              return false;
            }
        );

        Context.ensureForNodes(
            $('TABLE.available-items-table', element),
            'click',
            function (event) {
              var item_id = $(event.target).parentsUntil("TBODY", "TR").attr("data-id") || null;
              self.props.appContext.get('stores').menus.addItem(
                self.props.selectedEvent,
                self.props.selectedVendor,
                item_id
              ).then(function () {
                return self.props.appContext.get('stores').menus.loadForEvent(self.props.selectedEvent).then(function () {
                  self._trigger_forceUpdate();
                });
              });
            }
        );

        Context.ensureForNodes(
            $('TABLE.menu-items-table', element),
            'click',
            function (event) {
              var item_id = $(event.target).parentsUntil("TBODY", "TR").attr("data-id") || null;
              self.props.appContext.get('stores').menus.removeAtId(item_id).then(function () {
                return self.props.appContext.get('stores').menus.loadForEvent(self.props.selectedEvent).then(function () {
                  self._trigger_forceUpdate();
                });
              });
            }
        );


        // Init on load.

        if (self.props.selectedVendor) {
          var elm = $('#form-vendor-filter [data-fieldname="vendor_id"]');
          if (elm.dropdown('get value') !== self.props.selectedVendor) {
            elm.dropdown('set selected', self.props.selectedVendor);
          }
        }
        if (self.props.selectedConsumerGroup) {
          var elm = $('#form-create [data-fieldname="consumer_group_id"]');
          if (elm.dropdown('get value') !== self.props.selectedConsumerGroup) {
            elm.dropdown('set selected', self.props.selectedConsumerGroup);
          }
        }


        function fillEventCreateForm (values) {

          $('#form-create [data-fieldname]').each(function() {
            var elm = $(this);
            var name = elm.attr("data-fieldname");
            if (typeof values[name] === "undefined") return;
            var value = values[name] || "";

            if (elm.hasClass("dropdown")) {
              if (elm.dropdown('get value') === "" || typeof elm.dropdown('get value') === "object") {
                elm.dropdown('set selected', value);
              }
            } else {
              if (elm.val() === "") {
                elm.val(value);
              }
            }
          });
        }


      setTimeout(function () {
        fillEventCreateForm(Context.appContext.get("stores").events.getPresets());
      }, 100);

    },

    getHTML: function (Context) {

        var React = Context.REACT;


        var Panel = null;
        if (Context.selectedEvent) {

          var ReadyButton = Context.selectedEvent.get("format.menuReady");
          var DeliveredButton = Context.selectedEvent.get("format.delivered");

          if (!Context.selectedEvent.get("menuReady")) {
            ReadyButton = (
              <button data-link="action:ready" className="ui primary small button">
                  Ready
              </button>
            );
          } else
          if (!Context.selectedEvent.get("delivered")) {
            DeliveredButton = (
              <button data-link="action:delivered" className="ui primary small button">
                  Delivered
              </button>
            );
          }

          Panel = (
            <div className="ui segment">
              <button className="ui button" data-link="action:deselectEvent">Back to all events</button>

              <table className="ui celled selectable table events-table">
                <thead>
                  <tr>
                      <th>Date</th>
                      <th>Company</th>
                      <th>Pickup Location</th>
                      <th>Ready</th>
                      <th>Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{Context.selectedEvent.get("format.deliveryDate")}</td>
                    <td>{Context.selectedEvent.get("consumerGroup.title")}</td>
                    <td>{Context.selectedEvent.get("consumerGroup.pickupLocation")}</td>
                    <td>{ReadyButton}</td>
                    <td>{DeliveredButton}</td>
                  </tr>
                </tbody>
              </table>
              <table className="ui celled selectable table events-table">
                <thead>
                  <tr>
                      <th>Menu Email (on Ready)</th>
                      <th>Menu SMS (on Ready)</th>
                      <th>Order Deadline</th>
                      <th>Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{Context.selectedEvent.get("format.menuEmailTime")}</td>
                    <td>{(Context.selectedEvent.get("format.menuSmsTime"))}</td>
                    <td>{Context.selectedEvent.get("format.orderByTime")}</td>
                    <td>{Context.selectedEvent.get("format.deliveryTime")}</td>
                  </tr>
                </tbody>
              </table>

              <p>Lunchroom: <a href={Context.selectedEvent.get("menuUrl")}>{Context.selectedEvent.get("menuUrl")}</a></p>
              <p>Menu Email: <a href={Context.selectedEvent.get("menuEmailUrl")}>{Context.selectedEvent.get("menuEmailUrl")}</a></p>

              <p>NOTE: Only ONE Restaurant per day!</p>


              <div className="ui grid">
                <div className="eight wide left floated column">

                  <h2 className="ui header">Available Dishes</h2>

                  <form id="form-vendor-filter" className="ui form">
                    <div className="fields">
                      <div className="field">
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
                      </div>
                    </div>
                  </form>

                  <table className="ui celled table available-items-table">
                    <thead>
                      <tr>
                          <th>Name</th>
                          <th>Photo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Context.selectedVendorItems.map(function(item) {
                          var Row = (
                              <tr key={item.get('id')} data-id={item.get('id')}>
                                <td>{item.get("title")}</td>
                                <td><img className="ui centered image" src={item.get("photo_url")} height="70"/></td>
                              </tr>
                          );
                          return Row;
                      })}
                    </tbody>
                  </table>

                </div>
                <div className="eight wide right floated column">

                  <h2 className="ui header">Dishes on Menu</h2>

                  <table className="ui celled table menu-items-table">
                    <thead>
                      <tr>
                          <th>Name</th>
                          <th>Photo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Context.menuItems.map(function(item) {
                          var Row = (
                              <tr key={item.get('id')} data-id={item.get('id')}>
                                <td>{item.get("item.title")}</td>
                                <td><img className="ui centered image" src={item.get("item.photo_url")} height="70"/></td>
                              </tr>
                          );
                          return Row;
                      })}
                    </tbody>
                  </table>

                </div>
              </div>

              <button data-link="action:delete" className="ui primary small button">
                  Delete
              </button>

            </div>
          );
        } else {
          Panel = [(
            <div className="ui segment">

              <form id="form-create" className="ui form">

                <div className="ui error message">
                  <div className="header">Please correct fields!</div>
                </div>

                <div className="fields">

                  <div className="field">
                    <label>Company</label>
                    <div data-fieldname="consumer_group_id" className="ui floating dropdown labeled button">
                      <span className="text">Select</span>
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
                  </div>

                </div>

                <div className="fields">

                  <div className="field">
                    <label>Day</label>
                    <input type="text" data-fieldname="day_id"/>
                  </div>

                  <div className="field">
                    <label>Order by</label>
                    <input type="text" data-fieldname="orderByTime"/>
                  </div>

                  <div className="field">
                    <label>Delivery start</label>
                    <input type="text" data-fieldname="deliveryStartTime"/>
                  </div>

                  <div className="field">
                    <label>Pickup by</label>
                    <input type="text" data-fieldname="pickupEndTime"/>
                  </div>

                </div>

                <div className="fields">

                  <div className="field">
                    <label>Menu Email at (min: 9 AM)</label>
                    <input type="text" data-fieldname="menuEmailTime"/>
                  </div>

                  <div className="field">
                    <label>Menu SMS at (min: 9 AM)</label>
                    <input type="text" data-fieldname="menuSmsTime"/>
                  </div>

                  <div className="field">
                    <label>Goodybag Fee</label>
                    <input type="text" data-fieldname="goodybagFee"/>
                  </div>
                  <div className="field">
                    <label>&nbsp;</label>
                    <button className="ui primary small button form-submit">
                        Create Menu
                    </button>
                  </div>

                </div>
                  
              </form>
              <br/>
              <p>NOTE: Only ONE event per day!</p>
            </div>
          ), (
            <table className="ui celled selectable table events-table">
              <thead>
                <tr>
                    <th>Date</th>
                    <th>Email Time</th>
                    <th>SMS Time</th>
                    <th>Delivery Time</th>
                    <th>Ready</th>
                    <th>Delivered</th>
                </tr>
              </thead>
              <tbody>

                {Context.events.map(function(item) {

                    var Row = (
                        <tr key={item.get('id')} data-id={item.get('id')}>
                          <td>{item.get("format.deliveryDate")}</td>
                          <td>{item.get("format.menuEmailTime")}</td>
                          <td>{item.get("format.menuSmsTime")}</td>
                          <td>{item.get("format.deliveryTime")}</td>
                          <td>{item.get("format.menuReady")}</td>
                          <td>{item.get("format.delivered")}</td>
                        </tr>
                    );

                    return Row;
                })}

              </tbody>
            </table>
          )];
        }

        return (
          <div>
            <h1>Events Admin</h1>
            {Panel}
          </div>
        );
    }

}, {

    onMount: function () {
        this.props.appContext.get('stores').vendors.on("sync", this._trigger_forceUpdate);
        this.props.appContext.get('stores').consumerGroups.on("sync", this._trigger_forceUpdate);

        this.props.appContext.get('stores').vendors.reset();
        this.props.appContext.get('stores').vendors.fetch();

        this.props.appContext.get('stores').consumerGroups.reset();
        this.props.appContext.get('stores').consumerGroups.fetch();
    },

    onUnmount: function () {
        this.props.appContext.get('stores').vendors.off("sync", this._trigger_forceUpdate);
        this.props.appContext.get('stores').consumerGroups.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

        var events = self.props.appContext.get('stores').events;

        var vendors = self.props.appContext.get('stores').vendors;

        var consumerGroups = self.props.appContext.get('stores').consumerGroups;

        var items = self.props.appContext.get('stores').items;

        var menus = self.props.appContext.get('stores').menus;


        var eventRecords = [];
        if (
//          self.props.selectedDay &&
          self.props.selectedConsumerGroup
        ) {
          eventRecords = self.modelRecordsWithStore(events, events.where({
//            day_id: self.props.selectedDay,
            consumer_group_id: (""+self.props.selectedConsumerGroup)
          }));
          eventRecords = COMPONENT.API.UNDERSCORE.sortBy(eventRecords, function (record) {
            return record.get("day_id");
          });
          eventRecords.reverse();
        }

        var selectedEvent = null;
        var selectedVendorItems = [];
        var menuItems = [];
        if (self.props.selectedEvent) {

          selectedEvent = self.modelRecordsWithStore(events, events.where({
            id: self.props.selectedEvent
          }))[0] || null;

          menuItems = self.modelRecordsWithStore(menus, menus.where({
            event_id: self.props.selectedEvent
          }));

          if (self.props.selectedVendor) {

            console.log("get items for vendor selector", self.props.selectedVendor);

            selectedVendorItems = self.modelRecordsWithStore(items, items.where({
              vendor_id: ""+self.props.selectedVendor
            }));

            console.log("selectedVendorItems", selectedVendorItems);

          }

        }

        return {

            events: eventRecords,

            vendors: self.modelRecordsWithStore(vendors, vendors.where()),

            consumerGroups: self.modelRecordsWithStore(consumerGroups, consumerGroups.where()),

            selectedEvent: selectedEvent,
            selectedVendorItems: selectedVendorItems,
            menuItems: menuItems
        };
    }
});

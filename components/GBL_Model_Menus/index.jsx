/** @jsx React.DOM */
'use strict'

const UNDERSCORE = require("underscore");
var React = require('react')

module.exports = React.createClass({


    _on_sync: function () {
		this.forceUpdate();
    },
	componentDidMount: function () {
		this.props.appContext.stores.menus.on("sync", this._on_sync);
        $(".ui.dropdown", this.getDOMNode()).dropdown();
    },
    componentWillUnmount: function () {
		this.props.appContext.stores.menus.off("sync", this._on_sync);
    },


    render: function() {
    	var self = this;

        var menus = self.props.appContext.stores.menus;

        var _notify_onChange = UNDERSCORE.debounce(self._on_sync, 100);

        return (
          <div>
          	<h1>Menus per Restaurant & Company</h1>

            <table className="ui celled structured table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Vendor</th>
                  <th>Consumer Group</th>
                  <th></th>
                </tr>
                <tr>
                  <td>
                    <div className="ui selection dropdown">
                      <input type="hidden" name="day"/>
                      <div className="text"></div>
                      <i className="dropdown icon"></i>
                        <div className="menu">
                          <div className="item" data-value="1">Day 1</div>
                          <div className="item" data-value="2">Day 2</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div className="ui selection dropdown">
                      <input type="hidden" name="vendor"/>
                      <div className="text"></div>
                      <i className="dropdown icon"></i>
                        <div className="menu">
                            <div className="item" data-value="1">Restaurant 1</div>
                            <div className="item" data-value="2">Restaurant 2</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div className="ui selection dropdown">
                      <input type="hidden" name="consumer_group"/>
                      <div className="text"></div>
                      <i className="dropdown icon"></i>
                        <div className="menu">
                            <div className="item" data-value="1">Company 1</div>
                            <div className="item" data-value="2">Company 2</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <button className="ui primary small button">
                        Create Menu
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody>
	            {menus.modelRecords(menus.where()).map(function(item) {
                    // Re-draw ourselves on item model changes.
                    item.once("change", _notify_onChange);

                    var daytype = item.get("day.format.dddd-type");
                    if (daytype === "Weekend") {
                        daytype = (<b>{daytype}</b>);
                    }

                    var itemsId = item.id + "-items";

					return [(
                        <tr className="ui violet inverted segment" key={item.id}>
                          <td>
                            {item.get("day.format.ddd")} - {item.get("day.format.MMM")} - {item.get("day.format.D")}<br/>
                            {daytype}
                          </td>
                          <td>{item.get("format.vendor")}</td>
                          <td>{item.get("format.consumer_group")}</td>
                          <td></td>
                        </tr>
                    ), (
                        <tr key={itemsId}>
                            <td colSpan="3" width="100%">

                                <div className="ui celled list">
                                  <div className="item">
                                    <div className="ui avatar image">
                                      <img src="https://cdn.filepicker.io/api/file/6PqREn6qQHWCQsPdKJXK/convert?cache=true&fit=scale"/>
                                    </div>
                                    <div className="content">
                                      <div className="header">Snickerdoodle</div>
                                      An excellent companion
                                    </div>
                                    <div className="right floated content">
                                      <div className="ui small button">Remove</div>
                                    </div>
                                  </div>
                                  <div className="item">
                                    <div className="ui avatar image">
                                      <img src="https://cdn.filepicker.io/api/file/6PqREn6qQHWCQsPdKJXK/convert?cache=true&fit=scale"/>
                                    </div>
                                    <div className="content">
                                      <div className="header">Poodle</div>
                                      A poodle, its pretty basic
                                    </div>
                                    <div className="right floated content">
                                      <div className="ui small button">Remove</div>
                                    </div>
                                  </div>
                                  <div className="item">
                                    <div className="ui avatar image">
                                      <img src="https://cdn.filepicker.io/api/file/6PqREn6qQHWCQsPdKJXK/convert?cache=true&fit=scale"/>
                                    </div>
                                    <div className="content">
                                      <div className="header">Paulo</div>
                                      He's also a dog
                                    </div>
                                    <div className="right floated content">
                                      <div className="ui small button">Remove</div>
                                    </div>
                                  </div>
                                </div>

                            </td>
                            <td>
                                <button className="ui primary small button">
                                    Add Items
                                </button>
                            </td>
                        </tr>
					)];
		        })}
              </tbody>
            </table>
          </div>
        );
    }
});

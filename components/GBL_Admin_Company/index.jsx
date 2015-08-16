/** @jsx React.DOM */
'use strict'

var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({


    afterRender: function (Context, element) {

        var self = this;

        Context.ensureForNodes(
            $('.button[data-link]', element),
            'click',
            function () {

                if ($(this).attr("data-link") === "action:open-lunchroom") {
                    Context.appContext.get('stores').consumerGroups.setLunchroomOpenForId(
                        $(this).attr("data-id")
                    ).then(function () {
                        self.props.appContext.get('stores').consumerGroups.reset();
                        self.props.appContext.get('stores').consumerGroups.fetch();
                    });
                } else
                if ($(this).attr("data-link") === "action:close-lunchroom") {
                    Context.appContext.get('stores').consumerGroups.setLunchroomClosedForId(
                        $(this).attr("data-id")
                    ).then(function () {
                        self.props.appContext.get('stores').consumerGroups.reset();
                        self.props.appContext.get('stores').consumerGroups.fetch();
                    });
                }
            }
        );
        
    },

    getHTML: function (Context) {

        var React = Context.REACT;

        return (
          <div>
            <h1>Companies</h1>

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Title</th>
                    <th>Url</th>
                    <th>Open</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                {Context.consumerGroups.map(function(item) {

                    var Actions = null;
                    if (item.get("lunchroomLive")) {
                        Actions = (
                            <button data-link="action:close-lunchroom" data-id={item.get('id')} className="ui primary button">
                                Close Lunchroom
                            </button>
                        );
                    } else {
                        Actions = (
                            <button data-link="action:open-lunchroom" data-id={item.get('id')} className="ui primary button">
                                Open Lunchroom
                            </button>
                        );
                    }

                    var Row = (
                        <tr key={item.get('id')}>
                          <td>{item.get("title")}</td>
                          <td><a href={item.get("lunchroomUrl")} target="_blank">{item.get("lunchroomUrl")}</a></td>
                          <td>{item.get("format.lunchroomLive")}</td>
                          <td>{Actions}</td>
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
        this.props.appContext.get('stores').consumerGroups.on("sync", this._trigger_forceUpdate);

        this.props.appContext.get('stores').consumerGroups.reset();
        this.props.appContext.get('stores').consumerGroups.fetch();
    },

    onUnmount: function () {
        this.props.appContext.get('stores').consumerGroups.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

        var consumerGroups = self.props.appContext.get('stores').consumerGroups;

        var records = self.modelRecordsWithStore(consumerGroups, consumerGroups.where());

        records = COMPONENT.API.UNDERSCORE.sortBy(records, function (record) {
            return record.get("title");
        });

        return {
            consumerGroups: records
        };
    }
});

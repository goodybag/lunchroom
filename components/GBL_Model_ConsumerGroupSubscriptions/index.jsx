
var COMPONENT = require("../GBL_ReactComponent");

module.exports = COMPONENT.create({

    getHTML: function (Context) {

        var React = Context.REACT;

        return (
          <div>
            <h1>Items</h1>

            <table className="ui celled table">
              <thead>
                <tr>
                    <th>Time</th>
                    <th>Subscribed</th>
                    <th>Confirmed</th>
                </tr>
              </thead>
              <tbody>

                {Context.subscribers.map(function(item) {

                    var Row = (
                        <tr key={item.get('id')}>
                          <td>{item.get("subscribe_time")}</td>
                          <td>{item.get("subscribeEmail")}</td>
                          <td>{item.get("confirmedEmail")}</td>
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
        this.props.appContext.get('stores').consumerGroupSubscriptions.on("sync", this._on_sync);

        this.props.appContext.get('stores').consumerGroupSubscriptions.reset();
        this.props.appContext.get('stores').consumerGroupSubscriptions.fetch();
    },

    onUnmount: function () {
        this.props.appContext.get('stores').consumerGroupSubscriptions.off("sync", this._on_sync);
    },

    render: function() {
        var self = this;

        var subscribers = self.props.appContext.get('stores').consumerGroupSubscriptions;

        return {
            subscribers: self.modelRecordsWithStore(subscribers, subscribers.where())
        };
    }
});


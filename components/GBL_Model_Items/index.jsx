
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
                    <th>Title</th>
                    <th>Photo</th>
                </tr>
              </thead>
              <tbody>

                {Context.items.map(function(item) {

                    var Row = (
                        <tr key={item.id}>
                          <td>{item.get("title")}</td>
                          <td><img className="ui centered image" src={item.get("photo_url")} height="70"/></td>
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
        this.props.appContext.get('stores').items.on("sync", this._trigger_forceUpdate);

        this.props.appContext.get('stores').items.reset();
        this.props.appContext.get('stores').items.fetch();
    },

    onUnmount: function () {
        this.props.appContext.get('stores').items.off("sync", this._trigger_forceUpdate);
    },

    render: function() {
        var self = this;

        var items = self.props.appContext.get('stores').items;

        return {
            items: self.modelRecordsWithStore(items, items.where())
        };
    }
});


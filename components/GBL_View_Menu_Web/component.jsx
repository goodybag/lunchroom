
var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Menu_Web",

	    onMount: function () {
			this.props.appContext.get('stores').events.on("sync", this._trigger_forceUpdate);
			this.props.appContext.get('stores').menus.on("sync", this._trigger_forceUpdate);
			this.props.appContext.get('stores').items.on("sync", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.get('stores').events.off("sync", this._trigger_forceUpdate);
			this.props.appContext.get('stores').menus.off("sync", this._trigger_forceUpdate);
			this.props.appContext.get('stores').items.off("sync", this._trigger_forceUpdate);
	    },

	    render: function () {
	    	var self = this;

	        var events = self.props.appContext.get('stores').events;
	        var menus = self.props.appContext.get('stores').menus;

	        var eventIds = {};

	        var days = {};

	        self.modelRecordsWithStore(events, events.where()).forEach(function (item) {

				var ddd = item.get("day.format.ddd");
				days[ddd] = item;

	        	eventIds[item.get("id")] = ddd;
	        });

			var items = {};

	        self.modelRecordsWithStore(menus, menus.getForEventIds(eventIds)).forEach(function (item) {

				if (!items[eventIds[item.get("event_id")]]) {
					items[eventIds[item.get("event_id")]] = [];
				}
                // Group menu items per day
				items[eventIds[item.get("event_id")]].push(item);
	        });

	        return {

				eventToday: self.modelRecordsWithStore(events, events.getToday()).pop(),

	        	// Info for each event (multiple menus grouped by 'Mon", "Tue", ...)
	        	days: days,

	        	// The items for each day
	        	items: items
	        };
	    }
	});

}

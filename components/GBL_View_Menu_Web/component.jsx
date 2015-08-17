
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
	        var vendors = self.props.appContext.get('stores').vendors;

	        var eventIds = {};

	        var days = {};

	        self.modelRecordsWithStore(events, events.where()).forEach(function (item) {

				var ddd = item.get("day.format.ddd");
				days[ddd] = item;

	        	eventIds[item.get("id")] = ddd;
	        });


			var selectedEvent = self.props.appContext.get('stores').events.getModeledForDay(self.props.appContext.get('selectedDayId'));
			if (selectedEvent.length > 0) {
				if (selectedEvent.length > 1) {
					throw new Error("Only one event should be found!");
				}
				selectedEvent = selectedEvent[0];
			} else {
				selectedEvent = null;
			}


			var items = {};
			var vendorTitlesForEvents = {};

	        self.modelRecordsWithStore(menus, menus.getForEventIds(eventIds)).forEach(function (item) {

				if (!items[eventIds[item.get("event_id")]]) {
					items[eventIds[item.get("event_id")]] = [];
				}
                // Group menu items per day
				items[eventIds[item.get("event_id")]].push(item);

				// We only grap the first vendor for each event for now.
				// TODO: Grab more vendor IDs once we allow multiple per event.
				if (!vendorTitlesForEvents[item.get("event_id")]) {
					if (vendors.get(item.get("vendor_id"))) {
						vendorTitlesForEvents[item.get("event_id")] = vendors.get(item.get("vendor_id")).get("title");
					}
				}
	        });


	        var consumerGroups = self.props.appContext.get('stores').consumerGroups;
	        var consumerGroupSubscriptions = self.props.appContext.get('stores').consumerGroupSubscriptions;
			var consumerGroupSubscription = self.modelRecordsWithStore(consumerGroupSubscriptions, consumerGroupSubscriptions.where())[0];

	        return {

	        	vendorTitlesForEvents: vendorTitlesForEvents,

				eventToday: self.modelRecordsWithStore(events, events.getToday()).pop(),

				selectedEvent: selectedEvent,

	        	// Info for each event (multiple menus grouped by 'Mon", "Tue", ...)
	        	days: days,

	        	// The items for each day
	        	items: items,

	        	consumerGroupSubscription: consumerGroupSubscription,

	        	subscribeWithEmail: function (email, phone) {

					self.props.appContext.get('stores').consumerGroupSubscriptions.subscribeWithEmail(
						consumerGroups.where()[0].get("id"), email, phone
					);
				}	        	
	        };
	    }
	});

}

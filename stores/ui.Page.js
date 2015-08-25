
var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	var collection = DATA.init({

		name: "page",

		model: require("./ui.Page.model").forContext(context),
		record: {
// TODO: Use record and get rid of model

			"todaysEvent": {
				"linksTo": "events",
				// TODO: Implement
				/*
				"connect": function (data) {
					return data.connect('events/[day_id="' + this.selectedDay + '"]/id');
				}
				*/
				"derived": function () {
					return DATA.get('events/[day_id="' + context.appContext.get("todayId") + '"]/id');
				}
			},

			"selectedDay": {
				"linksTo": "days"
			},
			"selectedEvent": {
				"linksTo": "events",
				// TODO: Implement
				/*
				"connect": function (data) {
					return data.connect('events/[day_id="' + this.selectedDay + '"]/id');
				}
				*/
				"derived": function () {
					return DATA.get('events/[day_id="' + this.selectedDay + '"]/id');
				}
			},
			"selectedEventItems": {
				"linksTo": "menus",
				"derived": function () {

//console.log("GET SEECTED MENU ITEMS FOR SELECTE DAY", this);

					var records = DATA.get('menus/*[event_id="' + this.get("selectedEvent") + '"]');

//console.log("GET SEECTED MENU ITEMS FOR SELECTE DAY records", records);

					return records;

				}
			}
		},

		collection: {

		},

		// Low-level
		store: {


		}
	});

	return collection.store;
}


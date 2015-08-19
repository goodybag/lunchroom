
const MOMENT = require("moment");
const MOMENT_TZ = require("moment-timezone");


exports['for'] = function (API) {

	var DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		var session = req._FireNodeContext.session;

		// For event email we just load the event id
		if (
			req._FireNodeContext.config.type === "email" &&
			opts.arg
		) {
			return DB.getKnex()('events').where({
				"token": opts.arg
			}).select(
				'id',
				'consumer_group_id'
			).then(function (result) {

				if (result.length === 0) {
					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/"
						}
					});
					return false;
				}

				req._FireNodeContext.addLayer({
					session: {
						dbfilter: {
							event_id: result[0].id,
							consumer_group_id: result[0].consumer_group_id
						}
					}
				});

				return false;
			});
		}

/*
		if (
			session &&
			session.dbfilter &&
			session.dbfilter.event_id && 
			session.dbfilter.consumer_group_id && 
			!opts.arg
		) {

			// Redirect to alias url for consumer group.

			return DB.getKnex()('events').where({
				"id": session.dbfilter.event_id
			}).select('token').then(function (result) {

				if (result.length === 0) {
					// This should not happen but just in case.
					req._FireNodeContext.resetSession();
					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/"
						}
					});
					return false;
				}

				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/event-" + result[0].token
					}
				});
				return false;
			});

			return false;
		}
*/
		return DB.getKnex()('events').where({
			"token": opts.arg
		}).select(
			'id',
			'consumer_group_id'
		).then(function (result) {

			if (result.length === 0) {
				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/"
					}
				});
				return false;
			}

			// Now that we have the consumer group we find today's event.

console.log("Lookup event for", {
	"day_id": MOMENT_TZ.tz("America/Chicago").format("YYYY-MM-DD"),
	"consumer_group_id": result[0].consumer_group_id
});

			return DB.getKnex()('events').where({
				"day_id": MOMENT_TZ.tz("America/Chicago").format("YYYY-MM-DD"),
				"consumer_group_id": result[0].consumer_group_id
			}).select('id').then(function (result2) {

				if (result2.length === 0) {
					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/"
						}
					});
					return false;
				}


				req._FireNodeContext.addLayer({
					session: {
						dbfilter: {
							event_id: result2[0].id,
							consumer_group_id: result[0].consumer_group_id
						}
					}
				});

				return false;

			});

		});
	}

	return exports;
}

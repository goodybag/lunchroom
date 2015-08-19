
const MOMENT = require("moment");
const MOMENT_TZ = require("moment-timezone");


exports['for'] = function (API) {

	var DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		var session = req._FireNodeContext.session;
/*

		if (
			session &&
			session.dbfilter &&
			session.dbfilter.consumer_group_id
		) {

//			if (!opts.arg) {
				// Redirect to alias url for consumer group.

			return DB.getKnex()('consumer-groups').where({
				"id": session.dbfilter.consumer_group_id
			}).select('alias', 'lunchroomLive').then(function (result) {

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

console.log("result1b", result);

				if (result[0].lunchroomLive) {

					return DB.getKnex()('events').where({
						"day_id": MOMENT().format("YYYY-MM-DD"),					
					}).select('token').then(function (result2) {

console.log("result2b", result2);

						if (result2.length === 0) {

							req._FireNodeContext.addLayer({
								config: {
									externalRedirect: "/" + result[0].alias
								}
							});

							return false;
						}

						req._FireNodeContext.addLayer({
							config: {
								externalRedirect: "/event-" + result2[0].token
							}
						});
						return false;
					});
				}

				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/" + result[0].alias
					}
				});
				return false;
			});
//			}

			return false;
		}
*/
		if (!opts.arg) {

			// Redirect to default consumer group.

			req._FireNodeContext.addLayer({
				config: {
// TODO: Don't default to Bazaarvoice.
					externalRedirect: "/bazaarvoice"
				}
			});
			return false;
		}

		return DB.getKnex()('consumer-groups').where({
			"alias": opts.arg
		}).select('id', 'lunchroomLive').then(function (result) {

			if (result.length === 0) {
				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/"
					}
				});
				return false;
			}

console.log("result1a", result);

			if (result[0].lunchroomLive) {

console.log("Lookup event for", {
	"day_id": MOMENT_TZ.tz("America/Chicago").format("YYYY-MM-DD"),
	"consumer_group_id": result[0].id
});

				return DB.getKnex()('events').where({
					"day_id": MOMENT_TZ.tz("America/Chicago").format("YYYY-MM-DD"),
					"consumer_group_id": result[0].id
				}).select('token').then(function (result2) {

console.log("result2a", result2);

					if (result2.length === 0) {

						req._FireNodeContext.addLayer({
							session: {
								dbfilter: {
									consumer_group_id: result[0].id
								}
							}
						});

						return false;
					}

					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/event-" + result2[0].token
						}
					});
					return false;
				});
			}

			req._FireNodeContext.addLayer({
				session: {
					dbfilter: {
						consumer_group_id: result[0].id
					}
				}
			});

			return false;
		});
	}

	return exports;
}

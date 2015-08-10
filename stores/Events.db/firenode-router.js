
exports['for'] = function (API) {

	var DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		var session = req._FireNodeContext.session;

		if (
			session &&
			session.dbfilter &&
			session.dbfilter.event_id && 
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

		return DB.getKnex()('events').where({
			"token": opts.arg
		}).select('id').then(function (result) {

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
						event_id: result[0].id
					}
				}
			});

			return false;
		});
	}

	return exports;
}


exports.for = function (API) {

	const DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		var session = req._FireNodeContext.session;
		if (
			session &&
			session.dbfilter &&
			session.dbfilter.consumer_group_id
		) {

			if (!opts.arg) {
				// Redirect to alias url for consumer group.

				return DB.getKnex()('consumer-groups').where({
					"id": session.dbfilter.consumer_group_id
				}).select('alias').then(function (result) {

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
							externalRedirect: "/" + result[0].alias
						}
					});
					return false;
				});
			}

			return false;
		}

		if (!opts.arg) {

			// Redirect to default consumer group.

			req._FireNodeContext.addLayer({
				config: {
					externalRedirect: "/bazaarvoice"
				}
			});
			return false;
		}

		return DB.getKnex()('consumer-groups').where({
			"alias": opts.arg
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
						consumer_group_id: result[0].id
					}
				}
			});

			return false;
		});
	}

	return exports;
}

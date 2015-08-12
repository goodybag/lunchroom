
exports['for'] = function (API) {

	var DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		var session = req._FireNodeContext.session;

		if (
			session &&
			session.dbfilter &&
			session.dbfilter.order_id && 
			!opts.arg
		) {

			// Redirect to alias url for consumer group.

			return DB.getKnex()('orders').where({
				"id": session.dbfilter.order_id
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
						externalRedirect: "/order-" + result[0].orderHashId
					}
				});
				return false;
			});
		}

		return DB.getKnex()('orders').where({
			"orderHashId": opts.arg
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
						order_id: result[0].id
					}
				}
			});

			return false;
		});
	}

	return exports;
}

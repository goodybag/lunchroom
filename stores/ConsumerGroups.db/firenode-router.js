
exports.for = function (API) {

	const DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, arg) {

		var session = req._FireNodeContext.session;
		if (
			session &&
			session.dbfilter
		) {

			req._FireNodeContext.addLayer({
				config: {
					query: {
						dbfilter: session.dbfilter
					},
					clientContext: {
						query: {
							dbfilter: session.dbfilter
						}
					}
				}
			});

			return false;
		}

		return DB.getKnex()('consumer-groups').where({
			"alias": arg
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
				config: {
					query: {
						dbfilter: {
							consumer_group_id: result[0].id
						}
					},
					clientContext: {
						query: {
							dbfilter: {
								consumer_group_id: result[0].id
							}
						}
					}
				},
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

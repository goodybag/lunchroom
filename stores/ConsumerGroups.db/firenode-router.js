
exports.for = function (API) {

	const DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, arg) {

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
				}
			});

			return false;
		});
	}

	return exports;
}

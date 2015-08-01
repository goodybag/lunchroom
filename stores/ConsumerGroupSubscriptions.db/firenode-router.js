
exports.for = function (API) {

	const DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		if (req._FireNodeContext.config.router.action === "confirm") {

			return DB.getKnex()('consumer-group-subscriptions').where({
				"token": opts.arg
			}).select('id', 'subscribeEmail', 'confirmedEmail', 'consumer_group_id').then(function (result) {

				if (result.length === 0) {
					res.writeHead(404);
					res.end("Not Found!");
					return true;
				}

				function successResponse () {
					req._FireNodeContext.resetSession();
					req._FireNodeContext.addLayer({
						config: {
							externalRedirect: "/",
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
				}

				if (result[0].subscribeEmail === result[0].confirmedEmail) {
					return successResponse();
				}

				return DB.getKnex()('consumer-group-subscriptions').where({
					"id": result[0].id
				}).update({
					"confirmedEmail": result[0].subscribeEmail
				}).then(function () {

					return successResponse();
				});
			});
		}

		res.writeHead(404);
		res.end("Not Found!");
		return true;
	}

	return exports;
}

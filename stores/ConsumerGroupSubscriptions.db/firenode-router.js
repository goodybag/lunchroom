
exports['for'] = function (API) {

	var DB = require("../../server/db/bookshelf.knex.postgresql");


	var exports = {};

	exports.processRequest = function (req, res, opts) {

		return DB.getKnex()('consumer-group-subscriptions').where({
			"token": opts.arg
		}).select('id', 'subscribeEmail', 'confirmedEmail', 'consumer_group_id', 'consumer_group_id').then(function (result) {

			if (result.length === 0) {
				res.writeHead(404);
				res.end("Not Found!");
				return true;
			}

			function successResponse () {
				req._FireNodeContext.addLayer({
					config: {
						externalRedirect: "/"
					},
					session: {
						dbfilter: {
							consumer_group_id: result[0].consumer_group_id,
							email: result[0].subscribeEmail
						}
					}
				});
				return false;
			}

			if (req._FireNodeContext.config.router.action === "confirm") {

				if (result[0].subscribeEmail === result[0].confirmedEmail) {
					return successResponse();
				}

				// TODO: Error out if not latest or act on latest subscription record for user
				//       if multiple subscribe confirm links are sent/pending/present.

				return DB.getKnex()('consumer-group-subscriptions').where({
					"id": result[0].id
				}).update({
					"confirmedEmail": result[0].subscribeEmail,
					"active": true
				}).then(function () {

					return successResponse();
				});

			} else
			if (req._FireNodeContext.config.router.action === "unsubscribe") {

				return DB.getKnex()('consumer-group-subscriptions').where({
					"id": result[0].id
				}).update({
					"active": false
				}).then(function () {

					return successResponse();
				});
			}

			res.writeHead(404);
			res.end("Not Found!");
			return true;
		});
	}

	return exports;
}

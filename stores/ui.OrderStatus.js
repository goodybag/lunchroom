
var COMMON = require("./ui._common");


var ENDPOINT = COMMON.makeEndpointUrl("order-status");


var Record = COMMON.API.BACKBONE.Model.extend({
	idAttribute: "id"
});

var Store = COMMON.API.BACKBONE.Collection.extend({
	model: Record,
	url: ENDPOINT,
	parse: function(data) {
		return data.data.map(function (record) {
			return COMMON.API.UNDERSCORE.extend(record.attributes, {
				id: record.id
			});
		});
	}
});


exports['for'] = function (context) {

	var store = new Store();


	store.Model = require("./ui.OrderStatus.model").forContext(context);


	store.fetchStatusInfoForOrderHashId = function (orderHashId) {

		var deferred = COMMON.API.Q.defer();

		// TODO: Ensure new entries are added to collection
		//       instead of removing all other entries.
		store.fetch({
			reset: false,
			remove: false,
			data: $.param({
				"filter[orderHashId]": orderHashId
			}),
			success: function () {

				var status = store.Model.latestStatusForRecords(store.where({
					orderHashId: orderHashId
				}));

				var order = context.appContext.get('stores').orders.findWhere({
					orderHashId: orderHashId
				});

				if (order) {
			    	order.set("statusInfo", status);
				}

				return deferred.resolve(status);
			}
		});

		return deferred.promise;
	}

	store.setStatusForOrderHashId = function (orderHashId, statusId) {

		var self = this;
		return COMMON.API.Q.denodeify(function (callback) {

			var payload = {
				data: {
					type: "order-status",
					attributes: {
						orderHashId: orderHashId,
						status: statusId
					}
				}
			};

			return $.ajax({
				method: "POST",
				url: ENDPOINT + "/",
				contentType: "application/vnd.api+json",
				headers: {
					"Accept": "application/vnd.api+json"
				},
    			dataType: "json",
				data: JSON.stringify(payload)
			})
			.done(function (response) {

				store.fetchStatusInfoForOrderHashId(orderHashId);

			})
			.fail(function(err) {

// TODO: Ask user to submit again.
console.log("error!", err.stack);

				return callback(err);
			});
		})();
	}

	return store;
}


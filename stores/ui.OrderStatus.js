
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


	// @see http://ampersandjs.com/docs#ampersand-state
	var Model = COMMON.API.AMPERSAND_STATE.extend({
		props: {
			id: "string",
			orderHashId: "string",
			status: "string"
	    }
	});

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

				var records = store.where({
					orderHashId: orderHashId
				});

				var status = {
					active: null,
					activeTime: null,
					history: []
				};
				records.forEach(function (record) {
					status.history.push([
						COMMON.API.MOMENT.utc(record.get("time")).unix(),
						record.get("status")
					]);
				});
				status.history.sort(function (a, b) {
					if (a[0] === b[0]) return 0;
					if (a[0] > b[0]) return -1;
					return 1;
				});
				if (status.history.length > 0) {
					status.activeTime = status.history[0][0];
					status.active = status.history[0][1];
				}

				var order = context.appContext.get('stores').orders.findWhere({
					orderHashId: orderHashId
				});

				if (order) {
			    	order.set("statusInfo", status);
				}

				deferred.resolve(status);
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


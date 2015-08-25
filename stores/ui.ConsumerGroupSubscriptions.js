
var COMMON = require("./ui._common");
var DATA = require("./ui._data");


exports['for'] = function (context) {

	var collection = DATA.init({

		name: "consumer-group-subscriptions",

		model: require("./ui.ConsumerGroupSubscriptions.model").forContext(context),
		record: {
// TODO: Use record and get rid of model
		},

		collection: {			
// TODO: Clean collection
		},

		// Low-level
		store: {

// App
			subscribeWithEmail: function (consumer_group_id, email, phone) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {

					var payload = {
						data: {
							type: "consumer-group-subscriptions",
							attributes: {
								consumer_group_id: consumer_group_id,
								subscribeEmail: email || "",
								subscribePhone: phone || ""
							}
						}
					};

					return $.ajax({
						method: "POST",
						url: self.Source + "/",
						contentType: "application/vnd.api+json",
						headers: {
							"Accept": "application/vnd.api+json"
						},
		    			dataType: "json",
						data: JSON.stringify(payload)
					})
					.done(function (response) {

						return callback(null);
					})
					.fail(function(err) {

		// TODO: Ask user to submit again.
		console.log("error!", err.stack);

						return callback(err);
					});
				})().then(function () {

					return self.loadForEmail(email);
				});
			},

// App
			loadForEmail: function (email) {
				var self = this;
				return COMMON.API.Q.denodeify(function (callback) {
			        self.fetch({
			            reset: true,
			            remove: true,
			            data: $.param({
			                "filter[email]": email
			            }),
			            success: function () {
			            	return callback(null);
			            }
			        });
				})();
			},

			modelRecords: function (records) {
				var self = this;
				return COMMON.resolveForeignKeys(self, records, {
					"consumer_group_id": {
						store: require("./ui.ConsumerGroups"),
						model: context.appContext.get('stores').consumerGroups.Model,
						localFieldPrefix: "consumerGroup"
					}
				}).map(function (record, i) {
					// Store model on backbone row so we can re-use it on subsequent calls.
					// NOTE: We purposfully store the model using `records[i]` instead of `record`
					//       as `record` 
					if (self._byId[records[i].get("id")].__model) {
						return self._byId[records[i].get("id")].__model;
					}
					var fields = {};
					self.Model.getFields().forEach(function (field) {
						if (!records[i].has(field)) return;
						fields[field] = records[i].get(field);
					});
					return self._byId[records[i].get("id")].__model = new self.Model(fields);
				});
			}


		}
	});



	var store = collection.store;


	store.keepInLocalStorage = true;

	function getLocalStorageNamespace () {
		var ctx = context.appContext.get("context");
		return ctx.dbfilter.consumer_group_id;
	}

	function syncToLocalStorage () {
		if (!store.keepInLocalStorage) return;
		var record = store.where();
		if (
			record.length === 1 &&
			record[0].get("subscribeEmail")
		) {
			COMMON.storeLocalValueFor("email", getLocalStorageNamespace(), record[0].get("subscribeEmail"));
		}
	}
	store.on("reset", syncToLocalStorage);
	store.on("change", syncToLocalStorage);
	store.on("update", syncToLocalStorage);
	function recoverFromLocalStorage () {
		var email = COMMON.getLocalValueFor("email", getLocalStorageNamespace());
		if (email) {
			try {
				store.loadForEmail(email).fail(function (err) {
					throw err;
				});
			} catch (err) {
				console.error("Error recovering email from local storage");
			}
		}
	}
	setTimeout(function () {
		recoverFromLocalStorage();
	}, 100);



	return collection.store;
}


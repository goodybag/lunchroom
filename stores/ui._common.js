

// The API for the data stores running in the UI.
// Running all API access through here allows for easy porting later.
const API = exports.API = {
	Q: require("q"),
	BACKBONE: require('backbone'),
	UNDERSCORE: require('underscore'),
	AMPERSAND_STATE: require('ampersand-state'),
	MOMENT: require("moment"),
	NUMERAL: require("numeral"),
	UUID: require("uuid"),
	JWT: require('jsonwebtoken'),
	JSSHA: require("jssha"),
	CJSON: require("canonical-json")
};

const FIRENODE = require("firenode-for-jsonapi/client");


exports.makeEndpointUrl = function (name) {
	return window.location.origin + "/api/v1/" + name;
}



exports.init = function (sessionToken, context) {

	var client = new FIRENODE.Client(sessionToken, context);



console.log("FIRENODE.client", client);


}




// Resolve foreign keys by collecting all used keys and batch-querying
// the backend for values if not already found in loaded collection.

// OPTIMIZE: Pre-load collections with data using one larger data structure
//           generated by the server using SQL joins instead of loading data
//           per collection on demand.
//           To generate SQL needed to preload data, let this function collect
//           the metadata it uses to resolve calls at runtime and derive the query
//           from there.

exports.resolveForeignKeys = function (store, records, keys, wait, options) {

	var callerStack = new Error().stack;

	if (records.length === 0) {
		if (wait) {
			return API.Q.resolve([]);
		} else {
			return [];
		}
	}

	var key_ids = {};
	var key_id_map = {};

	records.forEach(function (record, i) {
		Object.keys(keys).forEach(function (key) {
			if (!key_ids[key]) {
				key_ids[key] = {};
			}
			if (!key_id_map[key]) {
				key_id_map[key] = {};
			}
			key_id_map[key][i] = record.get(key);
			if (!key_ids[key][key_id_map[key][i]]) {
				key_ids[key][key_id_map[key][i]] = [];
			}
			key_ids[key][key_id_map[key][i]].push(i);
		});
	});

	var idFieldName = (options && options.useIdField) || "id";

	var promises = Object.keys(keys).map(function (key) {
		// Resolve IDs and RE-render UI once resolved
		return keys[key].store.for({
			ids: Object.keys(key_ids[key])
		}).then(function (foreignStore) {
			Object.keys(key_ids[key]).forEach(function (foreign_key) {
				key_ids[key][foreign_key].forEach(function (i) {
					if (!store._byId[records[i].get(idFieldName)]) {
						console.error("callerStack", callerStack);
						console.log("idFieldName", idFieldName);
						console.log("records[i].get(idFieldName)", records[i].get(idFieldName));
						console.error("store._byId", store._byId);
						throw new Error("Record by " + idFieldName + " '" + records[i].get(idFieldName) + "' not found!");
					}
					if (!records[i].__model) {
						return;
					}
					try {
						if (keys[key].model) {
							var record = foreignStore.get(foreign_key);
							// NOTE: Sometimes this is not yet available due to 'for' call on
							//       store not waiting long enough.
							// TODO: Wait long enough for records to always be available.
							if (record) {
								var model = new keys[key].model(record.toJSON());
								var values = model.getAttributes({
								  props: true,
								  session: true,
								  derived: true
								});
								Object.keys(values).forEach(function (name) {
									records[i].__model[keys[key].localFieldPrefix + "." + name] = values[name];
								});
							}
						} else {
							records[i].__model[keys[key].localField] = foreignStore.get(foreign_key).get(keys[key].foreignField);
						}
					} catch (err) {
						console.error("key", key);
						console.error("foreign_key", foreign_key);
						console.error(err.stack);
						throw err;
					}
				});
			});
		});
	});

	if (wait) {
		return API.Q.all(promises).then(function () {
			return exports.resolveForeignKeys(store, records, keys, false, options);
		});
	}
	return records;
}



exports.makeFormatter = function (type) {

	if (type === "deliveryTime") {
		return {
			deps: [
				"deliveryStartTime",
				"deliveryEndTime"
			],
            fn: function () {
            	var deliveryStartTime = API.MOMENT(this.deliveryStartTime);
            	var deliveryEndTime = API.MOMENT(this.deliveryEndTime);
            	return deliveryStartTime.format("hh:mm") + "-" + deliveryEndTime.format("hh:mm A");
            }
	    };
	} else
	if (type === "deliveryDate") {
		return {
			deps: [
				"deliveryStartTime"
			],
            fn: function () {
            	var deliveryStartTime = API.MOMENT(this.deliveryStartTime);
            	return deliveryStartTime.format("dddd, MMM Do YYYY");
            }
	    };
	}

	throw new Error("Formatter of type '" + type + "' not supported!");
}


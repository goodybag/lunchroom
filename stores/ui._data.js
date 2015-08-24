
// @source https://github.com/LogicCores/0-data
// NOTE: This module is UNLICENSE.org by original author ChristophDorn.com


var ASSERT = require("assert");
var COMMON = require("./ui._common");
var EVENTS = require("eventemitter2");
// Below only works on server while above only works in browser.
if (EVENTS.EventEmitter2) EVENTS = EVENTS.EventEmitter2;




var seedData = null;

exports.setSeedData = function (data) {
	seedData = data;
}



var Collections = function () {
	var self = this;
	var collections = {};
	self.get = function (id) {
		return collections[id];
	}
	self.set = function (id, collection) {
		collections[id] = collection;
	}
}

var collections = new Collections();


exports.collection = function (name) {
	if (!collections.get(name)) {
		throw new Error("Collection with name '" + name + "' not registered!");
	}
	return collections.get(name);
}


var Consumer = exports.Consumer = function (rootCollections, rootCollectionsOptions) {
	var self = this;

	rootCollections = rootCollections || collections;
	rootCollectionsOptions = rootCollectionsOptions || {};

	var listeners = [];


	function attachListener (target, event, handler) {
		target.on(event, handler);
		listeners.push({
			destroy: function () {
				target.off(event, handler);
			}
		});
	}



	var connections = {};
	var subscriptions = {};


	self.connect = function (pointer, options, iterator) {

		if (typeof iterator === "undefined" && typeof options === "function") {
			iterator = options;
			options = null;
		}

		options = options || {};

		if (rootCollectionsOptions.pointerPrefix) {
			pointer = rootCollectionsOptions.pointerPrefix + pointer;
		}

		try {

			// 'page/loaded/selectedEvent/day_id'
			// 'page/loaded/selectedEvent/consumer_group_id/deliverLocation'
			// 'cart/itemCount()'
			// 'days/*'

			function buildSubscriptions (dictionary, pointerParts) {
				// A 'dictionary' is a collection or a record

				var subscriptions = [];

				var pointerSegment = null;

				pointerParts.forEach(function (pointerSegment, i) {

					var dictionaryForSegment = dictionary;

					var lastSegment = (i === pointerParts.length -1);

					function getLinksToForModel (Model) {
						var linksTo = (
							Model &&
							Model[pointerSegment] &&
							Model[pointerSegment].linksTo
						) || null;
						if (!linksTo) return null;
						var foreignDictionary = rootCollections.get(linksTo);
						if (!foreignDictionary) {
							throw new Error("Dictionary '" + linksTo + "' declared for '" + pointerSegment + "' not found!");
						}
						return {
							name: linksTo,
							dictionary: foreignDictionary
						};
					}

					var linksTo = getLinksToForModel(dictionaryForSegment.Record._definition);
					if (linksTo) {
						// Our dictionary holds a value that is a key in a foreign dictionary.
						// We continue resolving the pointer using this foreign dictionary.


						var consumer = null
						function getConsumer (collectionName) {
							if (!iterator) return null;
							if (consumer) return consumer;
							consumer = new Consumer(rootCollections, {
								pointerPrefix: collectionName + "/"
							});
							consumer.mapData(iterator(consumer));
						}


						subscriptions.push({
							_name: "linkToForeign",
							// These properties in this structure may update whenever getter chain executes							
							dictionary: dictionaryForSegment,
							query: pointerSegment,

							get: function () {

								var value = this.dictionary.get(this.query);

								if (Array.isArray(value) && value.length > 0) {
									// NOTE: We assume all records use the same model from the same collection!
									getConsumer(value[0].collection.Collection.Name);
								}

								return {
									query: value
								};
							}
						});

						subscriptions.push({
							_name: "linkToGet",
							dictionary: linksTo.dictionary,
							query: null,	// Set by prior subscription.
							get: function () {

								if (Array.isArray(this.query) && this.query.length > 0) {

									var records = this.query.map(function (record) {
										return consumer.getData(record);
									});

									return {
										dictionary: records
									};
								}


								if (typeof this.dictionary.get !== "function") {
									throw new Error("Dictionary '" + this.dictionary.toString() + "' does not implement method 'get()'");
								}

								return {
									dictionary: this.dictionary.get(this.query)
								};
							}
						});


						dictionary = linksTo.dictionary

					} else {
						// Our dictionary holds the value.


						// We may want to query more than one record with
						// attribute-based filtering or get everything.
//console.log("pointerSegment", pointerSegment);						
						var query = pointerSegment.match(/^(\*)?(\[([^=]+)="([^"]+)"\])?$/);
//console.log("query", query);						
						if (query) {

							var consumer = null
							if (iterator) {
								consumer = new Consumer({
									get: function () {
										return dictionaryForSegment;
									}
								}, {
									pointerPrefix: "x/"
								});

								consumer.mapData(iterator(consumer));
							}

							var where = {};
							if (query[2]) {

								where[query[3]] = query[4];

							}
//console.log("WHERE", where);

							subscriptions.push({
								_name: "query",
								// These properties in this structure may update whenever getter chain executes							
								dictionary: dictionaryForSegment,
								query: pointerSegment,

								get: function () {

									var records = this.dictionary.where(where);

									if (consumer) {
										records = records.map(function (record) {
											return consumer.getData(record);
										});
									}

									if (query[1]) {
										// Prefixed with '*' so we return multiple values
									} else {
										// Only return one value
										if (records.length > 1) {
											throw new Error("Query '" + pointerSegment + "' from pointer '" + pointer + "' returned more than one result!");
										}

										records = records.shift();
									}
//console.log("RECORDS", records);
									return {
										dictionary: records
									};
								}
							});

						} else
						// We may want to call a function instead of lookup a record by ID.
						if (/\(\)$/.test(pointerSegment)) {

							subscriptions.push({
								_name: "method",
								// These properties in this structure may update whenever getter chain executes							
								dictionary: dictionaryForSegment,
								query: pointerSegment,

								get: function () {

									var methodName = this.query.replace(/\(\)$/, "");

									if (typeof this.dictionary[methodName] !== "function") {
										throw new Error("Collection '" + this.dictionary.toString() + "' does not have method '" + methodName + "'");
									}

									return {
										dictionary: this.dictionary[methodName].call(this.dictionary)
									};
								}
							});

						} else {

							subscriptions.push({
								_name: "get",
								// These properties in this structure may update whenever getter chain executes							
								dictionary: dictionaryForSegment,
								query: pointerSegment,

								get: function () {

									if (typeof this.dictionary.get !== "function") {
										throw new Error("Dictionary '" + this.dictionary.toString() + "' does not implement method 'get()'");
									}

									return {
										dictionary: this.dictionary.get(this.query)
									};
								}
							});

						}
					}
				});

				return subscriptions;
			}



			var pointerParts = pointer.split("/");

			var rootCollection = pointerParts.shift();

			var collection = rootCollections.get(rootCollection);
			if (!collection) {
				throw new Error("Collection '" + rootCollection + "' not found!");
			}

			var subscriptions = buildSubscriptions(collection, pointerParts);


			var getter = function (dictionary) {
				try {
					var result = null;

//console.log("RESULT FOR", "subscriptions", subscriptions);

					subscriptions.forEach(function (subscription, i) {

						if (i === 0) {
							// The first subscription has the root dictionary
							// set correctly or we can override it. We query the subscription chain from here.
							if (dictionary) {
								subscription.dictionary = dictionary;
							}
						} else {
							// All other subscriptions get the dictionary set based
							// on the result of the previous subscription.
							if (typeof result.dictionary !== "undefined") {
								subscription.dictionary = result.dictionary;
							}
							if (typeof result.query !== "undefined") {
								subscription.query = result.query;
							}
						}

						result = subscription.get.call(subscription);

//console.log("RESULT FOR", result, i);

					});
					// 'dictionary' now contains the value at the end of the pointer
					var value = result.dictionary;

					if (
						typeof options.ifUndefined !== "undefined" &&
						typeof value === "undefined"
					) {
						value = options.ifUndefined;
					}

					if (
						typeof options.ifNot !== "undefined" &&
						!value
					) {
						value = options.ifNot;
					}

					if (typeof options.prefix !== "undefined") {
						value = options.prefix + value;
					}

					if (typeof options.suffix !== "undefined") {
						value = value + options.suffix;
					}

					return value;
				} catch (err) {
					console.error("Error while getting value for pointer '" + pointer + "':", err.stack);
					throw err;
				}
			}

			return getter;

		} catch (err) {
			console.error("Error while connecting data pointer:", pointer, options, err.stack);
			throw err;
		}
	}



	var dataMap = null;
	self.mapData = function (_dataMap) {
		dataMap = _dataMap;
	}

	self.getData = function (dictionary) {
		if (!dataMap) {
			throw new Error("Data has not yet been mapped!");
		}
		var data = {};
		Object.keys(dataMap).forEach(function (name) {
			if (typeof dataMap[name] !== "function") {
				console.error("dataMap[name]", dataMap, name, dataMap[name]);
				throw new Error("Value at '" + name + "' is not a function! Did you forget a 'linksTo' declaration?");
			}
			data[name] = dataMap[name](dictionary);
		});
		return data;
	}


	self.destroy = function () {

console.log("RELEASE ALL LISTENERS!");

		self.removeAllListeners();

		listeners.forEach(function (listener) {
			listener.destroy();
		});
	}
}
Consumer.prototype = Object.create(EVENTS.prototype);





exports.get = function (pointer) {

	var consumer = new Consumer(collections, {
		trackChanges: false
	});

//console.log("pointer", pointer);

	consumer.mapData({
		"value": consumer.connect(pointer)
	});

	var data = consumer.getData();

	if (typeof data.value === "undefined") {
		console.warn("No data at pointer '" + pointer + "'!");
	}

//console.log("GOT DATA", data, pointer);
//throw "STOP";

	return data.value;
}


exports.init = function (context) {

	function Collection (context) {
		var self = this;

		self.Name = context.name;

		self.Source = COMMON.makeEndpointUrl(self.Name);

		self.Record = COMMON.API.BACKBONE.Model.extend({
			initialize: function () {
				this._super_ = self.Record.__super__;
			},
  			idAttribute: "id",
  			Model: context.record,
			get: function (name) {
				var recordSelf = this;

//console.log("GET FROM RECORD", name);

				if (
					context.record &&
					context.record[name] &&
					typeof context.record[name].derived === "function"
				) {
					var attrs = Object.create(this.attributes);

					attrs.get = function (name) {
						return recordSelf.get(name);
					}

// TODO: If 'typeof context.record[name].connect === "function"' setup consumer and pass along so derived function can register further data connects.
					return context.record[name].derived.call(attrs);
				} else
				// TODO: Use 'context.record' instead of 'Model' once we relocate field declarations.
				if (
					self.store.Model._definition &&
					self.store.Model._definition.derived &&
					self.store.Model._definition.derived[name]
				) {
					return self.store.Model._definition.derived[name].fn.call(this.attributes);
				}
				return this._super_.get.call(this, name);
			}
/*
			where: function () {
				var args = Array.prototype.slice.call(arguments);

//				var records = 

			}
*/
		});

		self.Record._definition = context.record || {};


		self.Store = COMMON.API.BACKBONE.Collection.extend({

			url: self.Source,

			model: self.Record,

			parse: function (data) {
				return data.data.map(function (record) {
					return COMMON.API.UNDERSCORE.extend(record.attributes, {
						id: record.id
					});
				});
			}
		});

		self.store = new self.Store();
		self.store.Source = self.Source;
		self.store.Collection = self;

	    function emitDebounced (event) {
	    	if (!emitDebounced._actor) {
	    		emitDebounced._actor = {};
	    	}
	    	if (!emitDebounced._actor[event]) {
	    		emitDebounced._actor[event] = COMMON.API.UNDERSCORE.debounce(function () {
	    			self.emit(event);
	    		}, 10);
	    	}
	    	emitDebounced._actor[event]();
	    }


		// Fires when anything has changed.
		self.store.on("change", function () {
			emitDebounced("change");
		});
		self.store.on("sync", function () {
			emitDebounced("change");
		});
		self.store.on("update", function () {
			emitDebounced("change");
		});
		self.store.on("remove", function () {
			emitDebounced("change");
		});


		if (context.model) {
			self.store.Model = context.model;
		}

		if (context.store) {
			Object.keys(context.store).forEach(function (name) {				
				self.store[name] = function () {
					var args = Array.prototype.slice.call(arguments);
					// Call 'context.store' registered methods in the scope of the 'store'.
					return context.store[name].apply(self.store, args);
				};
			});
		}
	}
	Collection.prototype = Object.create(EVENTS.prototype);

	Collection.prototype.add = function (record) {
		return this.store.add(record);
	}
	Collection.prototype.get = function (id) {
		return this.store.get(id);
	}
	Collection.prototype.where = function (query) {
		return this.store.where(query);
	}


	var collection = new Collection(context);

	if (context.collection) {
		Object.keys(context.collection).forEach(function (name) {
			collection[name] = function () {
				var args = Array.prototype.slice.call(arguments);
				// Call 'context.collection' registered methods in the scope of the 'collection'.
				return context.collection[name].apply(collection, args);
			};
		});
	}


	if (
		seedData &&
		seedData[collection.Name]
	) {
		for (var id in seedData[collection.Name]) {
			collection.store.add(seedData[collection.Name][id]);
		};
	}


	// NOTE: We only register and keep track of the first one!
// TODO: Throw error once we have model subkey resolving cleaned up.
	if (!collections.get(context.name)) {
		collections.set(collection.Name, collection);
	}

	return collection;
}


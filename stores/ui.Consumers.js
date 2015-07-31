
const COMMON = require("./ui._common");

const BACKBONE = require('backbone');
const UNDERSCORE = require('underscore');


const ENDPOINT = COMMON.makeEndpointUrl("consumers");


var Entity = BACKBONE.Model.extend({
	idAttribute: "id"
});

var Entities = BACKBONE.Collection.extend({
	model: Entity,
	url: ENDPOINT,
	parse: function(data) {
		return data.data.map(function (record) {
			return UNDERSCORE.extend(record.attributes, {
				id: record.id
			});
		});
	}
});


exports.for = function () {

	var entities = new Entities();

/*
entities.on("all", function(eventName) {

	console.log("eventName", eventName);

	if (eventName === "sync") {

		console.log("list entities", entities.where());
		console.log("ITEM 5", entities.get(5));

	}
});
*/

//	entities.fetch();

	return entities;
}


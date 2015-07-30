
const PATH = require("path");
const EXPRESS_ROUTE_BUILDER = require('express-routebuilder');
const ENDPOINTS = require('endpoints');
const EXPRESS = require("express");


// Customize endpoints:
//  * Change routes filename
require("endpoints/es5/application/lib/parse_resource").routesFilename = "api.routes";
require("endpoints/es5/application/lib/parse_resource").controllerFilename = "api.controller";


module.exports = new ENDPOINTS.Application({
  	searchPaths: [
		PATH.join(__dirname, '../../stores')
  	],
	routeBuilder: function (routes, prefix) {

		// 'ConsumerGroups.db' -> 'consumer-groups'
		prefix = prefix.replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

		console.log("Register for base route: " + prefix);

	    return EXPRESS_ROUTE_BUILDER(EXPRESS.Router(), routes, prefix);
	},
	Controller: ENDPOINTS.Controller.extend({
		baseUrl: '/api/v1',
		store: ENDPOINTS.Store.bookshelf,
		format: ENDPOINTS.Format.jsonapi,
		validators: [
			ENDPOINTS.ValidateJsonSchema
		]
	})
});

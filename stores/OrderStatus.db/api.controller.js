
const PATH = require("path");
const API = require("../../server/db/api.endpoints");


// @docs http://endpointsjs.com
// @docs http://endpointsjs.com/guides/app-structure
// @docs http://endpointsjs.com/api/endpoints/0.5.6/Controller.html

module.exports = new API.Controller({
	model: require('./orm.model'),
	basePath: PATH.basename(__dirname)
});

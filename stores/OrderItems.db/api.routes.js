
var CONTROLLER = require('./api.controller');
var SCHEMA = require('./api.schema');


// @docs http://endpointsjs.com
// @docs http://endpointsjs.com/guides/app-structure
// @docs http://endpointsjs.com/api/endpoints/0.5.6/Controller.html

exports.map = {
    get: {
        '/': CONTROLLER.read(),
        '/:id': CONTROLLER.read(),
        '/:id/:related': CONTROLLER.readRelated(),
        '/:id/links/:relation': CONTROLLER.readRelation()
    }
};

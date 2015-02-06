var dirac = require('dirac');
var config = require('../config');

dirac.init(config.db.connectionStr);

dirac.use( dirac.dir( __dirname + '/dals' ) );

dirac.sync();

module.exports = dirac.dals;

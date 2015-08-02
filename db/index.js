var dirac = require('dirac');
var config = require('../config');

dirac.use( dirac.relationships() );
dirac.use( dirac.dir( __dirname + '/dals' ) );
dirac.register( require('express-dirac-session/dal') );

//dirac.init( config.db.connectionStr );

for ( var key in dirac.dals ){
  module.exports[ key ] = dirac.dals[ key ];
}

module.exports.dirac = dirac;

var fs        = require('fs');
var path      = require('path');
var camelcase = require('camel-case');
var utils     = require('../../lib/utils');

utils.extend( module.exports, require('stdm') );
utils.extend( module.exports, require('dirac-middleware') );

module.exports.locals = require('express-locals');

fs.readdirSync( __dirname )
  .filter( function( filename ){
    return filename !== 'index.js';
  })
  .filter( function( filename ){
    return ['.json', '.js'].indexOf( path.extname( filename ) ) > -1;
  })
  .map( function( filename ){
    return {
      name: path.basename( filename, path.extname( filename ) )
    , path: path.join( __dirname, filename )
    };
  })
  .forEach( function( file ){
    module.exports[ camelcase( file.name ) ] = require( file.path );
  });
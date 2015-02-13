var server  = module.exports = require('express')();
var hbs     = require('hbs');
var config  = require('../config');

hbs.handlebars = require('handlebars');

require('../lib/register-helpers')( hbs.handlebars );

server.set( 'view engine', 'hbs' );
server.set( 'views', __dirname );

server.use( require('body-parser').json() );
server.use( require('body-parser').urlencoded({ extended: true }) );

server.use( function( req, res, next ){
  res.locals.config = config;
  return next();
});

server.use( '/', require('./routes/lunchrooms') );
server.use( '/admin', require('./routes/admin') );
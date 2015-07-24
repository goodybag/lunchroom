var express = require('express');
var hbs     = require('hbs');
var config  = require('../config');
var m       = require('./middleware');

var server  = module.exports = express();

hbs.handlebars = require('handlebars');

require('../lib/register-helpers')( hbs.handlebars );

server.set( 'view engine', 'hbs' );
server.set( 'views', __dirname );

server.use( require('body-parser').json() );
server.use( require('body-parser').urlencoded({ extended: true }) );

server.use( express.static('public') );

server.use( function( req, res, next ){
  res.locals.config = config;
  return next();
});

server.get('/landing', m.view('views/landing-1', {
  layout: 'views/landing-layout'
}));

server.use( '/', require('./routes/lunchrooms') );
server.use( '/admin', require('./routes/admin') );
var router = module.exports = require('express').Router();

router.get( '/', function( req, res ){
  res.send('Hello, lunchroom world!');
});

router.get( '/:id', function( req, res ){
  res.send( 'This is lunchroom ' + req.params.id );
});
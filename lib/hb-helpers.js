var usd     = require('usd');
var utils   = require('utils');
var blocks  = {};

module.exports.extend = function( name, context ){
  var block = blocks[ name ];
  if ( !block ){
    block = blocks[ name ] = [];
  }

  // for older versions of handlebars, use block.push(context(this));
  block.push( context.fn(this) );
};

module.exports.block = function( name ){
  var val = ( blocks[name] || [] ).join('\n');

  // clear the block
  blocks[ name ] = [];

  return val;
};

module.exports.dollars = function( pennies ){
  return usd().pennies( pennies ).dollars();
};

module.exports.pennies = function( pennies ){
  return usd().dollars( dollars ).pennies();
};
var helpers = require('./hb-helpers');

module.exports = function( handlebars ){
  Object
    .keys( helpers )
    .forEach( function( helper ){
      handlebars.registerHelper( helper, helpers[ helper ] );
    });
};
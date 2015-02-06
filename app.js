var config = require('./config');
var server = require('./server');

server.listen( config.http.port, function(){
  console.log('Server listening on port', config.http.port );
});
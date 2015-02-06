var server = module.exports = require('express')();

server.use( '/rooms', require('./routes/lunchrooms') );

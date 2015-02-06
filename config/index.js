var _ = require('lodash');

var config = {};

config.defaults = {
  http: require('./http')
, db: { connectionStr: 'postgres://localhost/lunchroom' }
};

config.dev = require('./dev');
config.staging = require('./staging');
config.production = require('./production');

var GB_ENV = process.env.GB_ENV = process.env.GB_ENV || 'dev';
if (GB_ENV === null || !config.hasOwnProperty(GB_ENV)) GB_ENV = 'dev';
module.exports = _.defaults(config[GB_ENV], config.defaults);

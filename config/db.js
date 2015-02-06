module.exports = {
  connectionStr: 'postgres://localhost:5432/lunchroom'
};

if ( ['production'].indexOf( process.env.GB_ENV ) > -1 ){
  module.exports.connectionStr = process.env['DATABASE_URL'];
}
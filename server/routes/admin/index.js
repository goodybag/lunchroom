var m = require('../../middleware');
var app = module.exports = require('express').Router();

app.get('/kitchen-sink'
, m.view('routes/admin/views/kitchen-sinkk', {
    layout: 'views/layout'
  })
);
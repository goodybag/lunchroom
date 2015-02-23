var m = require('../../middleware');
var app = module.exports = require('express').Router();

app.get('/kitchen-sink'
, m.locals({
    items: []
  })
, m.view('routes/admin/views/kitchen-sink', {
    layout: 'views/layout'
  })
);
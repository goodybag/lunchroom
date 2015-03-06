var m = require('../../middleware');
var app = module.exports = require('express').Router();
var usd = require('usd');

app.get('/kitchen-sink'
, m.locals({
    items:  [ { name: 'Pirata Dos Tacos'
              , price: usd().pennies(1090)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Poop Taco Box'
              , price: usd().pennies(1200)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Pirata Dos Tacos'
              , price: usd().pennies(1090)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Poop Taco Box'
              , price: usd().pennies(1200)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Poop Taco Box'
              , price: usd().pennies(1200)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Pirata Dos Tacos'
              , price: usd().pennies(1090)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Poop Taco Box'
              , price: usd().pennies(1200)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Poop Taco Box'
              , price: usd().pennies(1200)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Pirata Dos Tacos'
              , price: usd().pennies(1090)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            , { name: 'Poop Taco Box'
              , price: usd().pennies(1200)
              , dietTags: ['gluten-free', 'spicy']
              , coverPhotoUrl: 'https://cdn.filepicker.io/api/file/JEjlpwrGSrK4D9VjpHkc'
              }
            ]
  }, { cloneDeep: false })
, function( req, res, next ){
    res.locals.items.forEach(function(item){
      console.log(item.price.toDollars());
    });
    next();
  }
, m.view('routes/admin/views/kitchen-sink', {
    layout: 'views/layout'
  })
);
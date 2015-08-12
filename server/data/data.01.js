
exports.seeds = {
  "consumer-groups": {
    "1": {
      "id": 1,
      "title": "Bazaarvoice",
      "alias": "bazaarvoice",
      contact: "Gillian Lambert",
      address: "7901 Cameron Rd<br/>Bldg 2, Ste. 300<br/>Austin, TX 78754",
      pickupLocation: "3rd floor Game Room!",
      orderTax: "5"
    },
    "2": {
      "id": 2,
      "title": "Test: Hungry Planet",
      "alias": "test-hp",
      contact: "Big belly",
      address: "Somewhere<br/>accross the<br/>Rainbow",
      pickupLocation: "In the clouds",
      orderTax: "15"
    }
  }
};

exports.cater = {
  "events": {
    "11690": {
      "overrides": {
        "vendor": {
          "adminAccessToken": "30B39536-C5F2-4FFB-87C0-2AB7CB719859",
          "title": "Torchy's"
        }
      },
      "record": {
        id: 11690,
        created_at: 'Sat Aug 01 2015 17:27:22 GMT-0500 (CDT)',
        restaurant_id: 425,
        name: 'Lunchroom 1',
        description: null,
        order: 9,
        menus: [ 'individual' ],
        is_hidden: true,
        items: 
         [ { id: 96007,
             created_at: '2015-08-01 22:30:23.925459',
             restaurant_id: 425,
             category_id: 11690,
             order: 3,
             name: 'Baja Shrimp',
             description: null,
             price: 425,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/7emdVxvCTfa9OEmxkJE5' },
           { id: 96005,
             created_at: '2015-08-01 22:28:55.485566',
             restaurant_id: 425,
             category_id: 11690,
             order: 1,
             name: 'The Democrat',
             description: null,
             price: 400,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/iyYOevNJTsu0Xb6P5vn2' },
           { id: 96008,
             created_at: '2015-08-01 22:31:04.461486',
             restaurant_id: 425,
             category_id: 11690,
             order: 4,
             name: 'The Independent',
             description: null,
             price: 350,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/tIM7mngFQfGt4X7cyotG' },
           { id: 96006,
             created_at: '2015-08-01 22:29:40.431295',
             restaurant_id: 425,
             category_id: 11690,
             order: 2,
             name: 'Trailer Park',
             description: null,
             price: 375,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/YKULdnA1RLeM6iHFY5vv' }
        ]
      }
    },
    "11686": {
      "overrides": {
        "vendor": {
          "adminAccessToken": "4FAA859C-E317-4A20-824E-5563037C8348",
          "title": "Trudy's"
        }
      },
      "record": {
        id: 11686,
        created_at: 'Sat Aug 01 2015 16:53:52 GMT-0500 (CDT)',
        restaurant_id: 71,
        name: 'Lunchroom 1',
        description: null,
        order: 11,
        menus: [ 'individual' ],
        is_hidden: true,
        items: 
         [ { id: 95990,
             created_at: '2015-08-01 21:59:46.1838',
             restaurant_id: 71,
             category_id: 11686,
             order: 1,
             name: 'Beef Enchilada Plate with Rice & Beans',
             description: null,
             price: 800,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/M3tkymCMQVSkGcfXfEBG' },
           { id: 95991,
             created_at: '2015-08-01 22:00:39.671837',
             restaurant_id: 71,
             category_id: 11686,
             order: 2,
             name: 'Chicken Enchilada Plate with Rice & Beans',
             description: null,
             price: 800,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/oR2alN9QeCEuXqVbPKQF' },
           { id: 95993,
             created_at: '2015-08-01 22:03:22.728959',
             restaurant_id: 71,
             category_id: 11686,
             order: 3,
             name: 'Chicken Fajita Tacos with Rice & Beans',
             description: null,
             price: 900,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/PAtQfjiHRnWEFMtGzMOb' },
           { id: 95992,
             created_at: '2015-08-01 22:02:02.145439',
             restaurant_id: 71,
             category_id: 11686,
             order: 4,
             name: 'Spinach Enchilada Plate with Rice & Beans',
             description: null,
             price: 800,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/ehYvejaUTHy3dcNsdywh' }
          ]
      }
    },
    "11687": {
      "overrides": {
        "vendor": {
          "adminAccessToken": "6CA2C442-1E3E-4871-AFEA-8513DDAE22E3",
          "title": "McAlister's"
        }
      },
      "record": {
        id: 11687,
        created_at: 'Sat Aug 01 2015 17:08:34 GMT-0500 (CDT)',
        restaurant_id: 10,
        name: 'Lunchroom 1',
        description: null,
        order: 21,
        menus: [ 'individual' ],
        is_hidden: true,
        items:
         [ { id: 95994,
             created_at: '2015-08-01 22:09:39.471801',
             restaurant_id: 10,
             category_id: 11687,
             order: 1,
             name: 'Club Sandwich Box Lunch with Chips',
             description: null,
             price: 799,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/8NQBDg0TYqRdVbPPWUua' },
           { id: 95995,
             created_at: '2015-08-01 22:10:45.512981',
             restaurant_id: 10,
             category_id: 11687,
             order: 2,
             name: 'Harvest Chicken Salad Croissant Box Lunch with Chips',
             description: null,
             price: 799,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/EBx3ko0TmGDtgp44ueCP' },
           { id: 95996,
             created_at: '2015-08-01 22:11:38.843513',
             restaurant_id: 10,
             category_id: 11687,
             order: 3,
             name: 'Savannah Chopped Salad',
             description: null,
             price: 850,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/fLs2TrhqQMqOsKVENDg3' },
           { id: 95997,
             created_at: '2015-08-01 22:12:37.356445',
             restaurant_id: 10,
             category_id: 11687,
             order: 4,
             name: 'Veggie Club Box Lunch with Chips',
             description: null,
             price: 799,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/04MIZD7cQ8eKXsdqFEFQ' }
          ]
      }
    },
    "11688": {
      "overrides": {
        "vendor": {
          "adminAccessToken": "E24474B8-CA04-46BA-BBA5-6A7DD393A755",
          "title": "Teriyaki Madness"
        }
      },
      "record": {
        id: 11688,
        created_at: 'Sat Aug 01 2015 17:15:59 GMT-0500 (CDT)',
        restaurant_id: 188,
        name: 'Lunchroom 1',
        description: null,
        order: 16,
        menus: [ 'individual' ],
        is_hidden: true,
        items: 
         [ { id: 95998,
             created_at: '2015-08-01 22:16:53.708577',
             restaurant_id: 188,
             category_id: 11688,
             order: 1,
             name: 'Beef Teriyaki Bowl with White Rice & Veggies',
             description: null,
             price: 849,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/SpkFwdlTsC9d0JqVm6zF' },
           { id: 95999,
             created_at: '2015-08-01 22:17:44.575352',
             restaurant_id: 188,
             category_id: 11688,
             order: 2,
             name: 'Chicken Teriyaki Bowl with White Rice & Veggies',
             description: null,
             price: 749,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/LFqQ95yoQfiStl13BmSg' },
           { id: 96000,
             created_at: '2015-08-01 22:18:35.889735',
             restaurant_id: 188,
             category_id: 11688,
             order: 3,
             name: 'Mad Salad with Chicken Breast',
             description: null,
             price: 779,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/lkbgHbvrRBuQaoaUB7KG' },
           { id: 96001,
             created_at: '2015-08-01 22:19:21.481026',
             restaurant_id: 188,
             category_id: 11688,
             order: 4,
             name: 'Tofu Teriyaki Bowl with White Rice & Veggies',
             description: null,
             price: 699,
             feeds_min: 1,
             feeds_max: 1,
             options_sets: null,
             is_hidden: false,
             min_qty: 0,
             hide_pricing: false,
             photo_url: 'https://www.filepicker.io/api/file/0NECZBOWS2fB8iuswYww' }
          ]
      }
    }
  }
};
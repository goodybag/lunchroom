
// @docs http://endpointsjs.com
// @docs http://endpointsjs.com/guides/app-structure
// @docs http://endpointsjs.com/api/endpoints/0.5.6/Controller.html

module.exports = {
    body: {
        properties: {
            id: {
                type: 'integer'
            },


            // NOTE: When you make changes here, you
            //       LIKELY ALSO WANT TO MAKE CHANGES
            //       here './db.schema.js'!

            title: {
                type: 'string'
            },
            alias: {
                type: 'string'
            },
            contact: {
                type: 'string'
            },
            address: {
                type: 'string'
            },
            pickupLocation: {
                type: 'string'
            },
            orderTax: {
                type: 'string'
            }

        }
    }
};

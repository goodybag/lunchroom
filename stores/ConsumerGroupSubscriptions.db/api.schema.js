
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

            token: {
                type: 'string'
            },
            consumer_id: {
                type: 'string'
            },
            vendor_id: {
                type: 'string'
            },
            subscribe_time: {
                type: 'string'
            },
            confirmed_time: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            confirmedEmail: {
                type: 'string'
            }
        }
    }
};

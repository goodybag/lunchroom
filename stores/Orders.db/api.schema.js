
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

            orderHashId: {
                type: 'string'
            },
            time: {
                type: 'string'
            },
            day_id: {
                type: 'string'
            },
            form: {
                type: 'string'
            },
            items: {
                type: 'string'
            },
            event: {
                type: 'string'
            },
            vendor_ids: {
                type: 'string'
            },
            orderFrom: {
                type: 'string'
            },
            deliveryStartTime: {
                type: 'string'
            },
            deliveryEndTime: {
                type: 'string'
            }
        }
    }
};

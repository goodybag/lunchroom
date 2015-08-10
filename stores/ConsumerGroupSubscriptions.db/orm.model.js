
var PATH = require("path");
var BASE_MODEL = require("../../server/db/base_model.bookshelf");

var TABLE_NAME = PATH.basename(__dirname)
  .replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


// @docs http://bookshelfjs.org/#Model

var instanceProps = {
    tableName: TABLE_NAME
};


var classProps = {
    typeName: TABLE_NAME,
    filters: {
        id: function (qb, value) {
            return qb.whereIn('id', value);
        },
        email: function (qb, value) {            
            return qb.where({
                'subscribeEmail': value
            }).orderBy('subscribe_time', 'desc').limit(1);
        }
    },
    relations: [
    ]
};


module.exports = BASE_MODEL.extend(instanceProps, classProps);



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
        day_id: function (qb, value) {
            return qb.whereIn('day_id', value);
        },
        consumer_group_id: function (qb, value) {
            return qb.whereIn('consumer_group_id', value);
        }
    },
    relations: [
    ]
};


module.exports = BASE_MODEL.extend(instanceProps, classProps);


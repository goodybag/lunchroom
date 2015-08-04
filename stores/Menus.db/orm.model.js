
const PATH = require("path");
const BASE_MODEL = require("../../server/db/base_model.bookshelf");

const TABLE_NAME = PATH.basename(__dirname)
  .replace(/\.db$/, "").replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();


// @docs http://bookshelfjs.org/#Model

const instanceProps = {
    tableName: TABLE_NAME
};


const classProps = {
    typeName: TABLE_NAME,
    filters: {
        id: function (qb, value) {
            return qb.whereIn('id', value);
        },
        event_id: function (qb, value) {
            return qb.whereIn('event_id', value);
        }
    },
    relations: [
    ]
};


module.exports = BASE_MODEL.extend(instanceProps, classProps);


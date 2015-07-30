
const BOOKSHELF = require('./bookshelf.knex.postgresql');

var bookshelf = BOOKSHELF.getBookshelf();

const instanceProps = {};
const classProps = {
  transaction: bookshelf.transaction.bind(bookshelf)
};

module.exports = bookshelf.Model.extend(instanceProps, classProps);

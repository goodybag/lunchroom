module.exports = {
  name: 'payment_methods'

, schema: {
    id: { type: 'int', primaryKey: true }
  , createdAt: { type: 'timestamp', default: 'now()' }
  , uri: { type: 'text' }
  }
};

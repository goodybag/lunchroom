module.exports = {
  name: 'lunchrooms'

, schema: {
    id:         { type: 'int', primaryKey: true }
  , createdAt:  { type: 'timestamp', default: 'now()' }
  }
};

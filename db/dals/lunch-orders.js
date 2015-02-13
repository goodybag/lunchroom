module.exports = {
  name: 'lunch_orders'

, schema: {
    id: { type: 'int', primaryKey: true }
  , createdAt:  { type: 'timestamp', default: 'now()' }
  , lunchroom_id: { type: 'int', references: { table: 'lunchrooms', column: 'id' } }
  , restaurant_id: { type: 'int' } // reference offline restaurants (api)
  , daterange: { type: 'daterange' }
  }
};

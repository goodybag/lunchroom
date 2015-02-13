module.exports = {
  name: 'meal_items'

, schema: {
    id: { type: 'int', primaryKey: true }
  , createdAt: { type: 'timestamp', default: 'now()' }
  , name: { type: 'text' }
  , description: { type: 'text' }
  , other: { type: 'json' }
  , price: { type: 'int', default: 0 }
  , meal_id: { type: 'int', references: { table: 'meals', column: 'id' } }
  }
};

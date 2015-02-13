module.exports = {
  name: 'meals'

, schema: {
    id:         { type: 'int', primaryKey: true }
  , createdAt:  { type: 'timestamp', default: 'now()' }
  , user_name: { type: 'text' }
  , user_email: { type: 'text' }
  , payment_method_id: { type: 'int', references: { table: 'payment_methods', column: 'id' } }
  , sales_tax: { type: 'int', default: 0 }
  , total: { type: 'int', default: 0 }
  }
};

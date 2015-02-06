module.exports = {
  name: 'lunchrooms'

, schema: {
    id:         { type: 'int', primaryKey: true }
  , createdAt:  { type: 'timestamp', default: 'now()' }
  , user_name: { type: 'text' }
  , user_email: { type: 'text' }
  , organization: { type: 'text' }
  , street: { type: 'text' }
  , street2: { type: 'text' }
  , city: { type: 'text' }
  , state: { type: 'varchar(10)' }
  , zip: { type: 'varchar(5)', checks: ["SIMILAR TO '[[:digit:]]{5}'"] }
  , time: { type: 'time without time zone' }
  }
};

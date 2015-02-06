module.exports = {
  name: 'users'
, schema: {
    id:               { type: 'serial', primaryKey: true }
  , groups:           { type: 'text[]', notNull: true, default: 'Array[]::text[]' }
  , email:            { type: 'text' }
  , password:         { type: 'text' }
  , facebook_id:      { type: 'text' }
  , facebook_token:   { type: 'text' }
  }
};

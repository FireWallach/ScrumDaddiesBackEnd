// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var personSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  }
});

// the schema is useless so far
// we need to create a model using it
var Person = mongoose.model('Person', personSchema);

// make this available to our users in our Node applications
module.exports = Person;
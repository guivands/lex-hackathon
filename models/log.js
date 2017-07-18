// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var logSchema = new Schema({
  senderId: String,
  message: String,
  datetime: Date
});

logSchema.pre('save', function(next) {
  // get the current date
  this.datetime = new Date();

  next();
});

// the schema is useless so far
// we need to create a model using it
var Log = mongoose.model('Log', logSchema);

// make this available to our users in our Node applications
module.exports = Log;
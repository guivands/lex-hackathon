var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var userStatusSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    current_state: ['BLOCKED', 'STAGE_1'],
    last_interaction_timestamp: Date,
    last_page_interacted: String,
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
userStatusSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var UserStatus = mongoose.model('UserStatus', userStatusSchema);

// make this available to our users in our Node applications
module.exports = UserStatus;
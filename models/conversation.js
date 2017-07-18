var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var conversationSchema = new Schema({
    fb_page: { type: Schema.Types.ObjectId, ref: 'FbPage' },
    code: String,
    response: Schema.Types.Mixed
});

// the schema is useless so far
// we need to create a model using it
var conversation = mongoose.model('Conversation', conversationSchema);

// make this available to our users in our Node applications
module.exports = conversation;
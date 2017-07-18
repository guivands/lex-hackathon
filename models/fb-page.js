var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var fbPageSchema = new Schema({
    fb_page: String,
    page_token: String,
    name: String,
    default_answer: String,
    error_answer: String
});

// the schema is useless so far
// we need to create a model using it
var fbPage = mongoose.model('FbPage', fbPageSchema);

// make this available to our users in our Node applications
module.exports = fbPage;
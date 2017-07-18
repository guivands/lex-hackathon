var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a schema
var userInventorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    // items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
    items:[{
        code:String,
        data:String,
        used:Boolean
    }]
});

// the schema is useless so far
// we need to create a model using it
var UserInventory = mongoose.model('UserIventory', userInventorySchema);

// make this available to our users in our Node applications
module.exports = UserInventory;
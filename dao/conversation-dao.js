var Conversation = require('../models/conversation');
var self = Conversation;

function create(newObject) {
    var newEntity = new self();
    
    for(var key in self.schema.obj) {
        newEntity[key] = newObject[key];
    }
    
    return newEntity.save();
}

function update(conversation) {
    return Conversation.findOneAndUpdate({ _id: conversation._id }, conversation);
}

function findAll() {
    return Conversation.find();
}

function findById(id) {
    return Conversation.findById(id);
}

function findByQuery(query) {
    return Conversation.find(query);
}

function remove(query) {
    return Conversation.findOneAndRemove(query);
}

module.exports = {
    create: create,
    update: update,
    findAll: findAll,
    findByQuery: findByQuery,
    findById: findById,
    remove: remove
}
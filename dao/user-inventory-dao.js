var UserInventory = require('../models/user-inventory');
var self = UserInventory;

function create(newObject) {
    var newEntity = new self();
    
    for(var key in self.schema.obj) {
        newEntity[key] = newObject[key];
    }
    
    return newEntity.save();
}

function update(usr) {
    return UserInventory.findOneAndUpdate({ _id: usr._id }, usr);
}

function updateExisting(usr) {
    usr.markModified('items');
    return usr.save();
}

function findAll() {
    return UserInventory.find();
}

function findById(id) {
    return UserInventory.findById(id);
}

function findByQuery(query) {
    return UserInventory.find(query);
}

function remove(query) {
    return UserInventory.findOneAndRemove(query);
}

module.exports = {
    create: create,
    update: update,
    updateExisting: updateExisting,
    findAll: findAll,
    findByQuery: findByQuery,
    findById: findById,
    remove: remove
}
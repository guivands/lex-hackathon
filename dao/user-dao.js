var User = require('../models/user');
var self = User;

function create(newObject) {
    var newEntity = new self();
    
    for(var key in self.schema.obj) {
        newEntity[key] = newObject[key];
    }
    
    return newEntity.save();
}

function update(usr) {
    return User.findOneAndUpdate({ _id: usr._id }, usr);
}

function updateExisting(usr) {
    usr.markModified('fb_id');
    usr.markModified('photo');
    return usr.save();
}

function findAll() {
    return User.find();
}

function findById(id) {
    return User.findById(id);
}

function findByQuery(query) {
    return User.find(query);
}

function remove(query) {
    return User.findOneAndRemove(query);
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
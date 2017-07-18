var FbPage = require('../models/fb-page');
var self = FbPage;

function create(newObject) {
    var newEntity = new self();
    
    for(var key in self.schema.obj) {
        newEntity[key] = newObject[key];
    }
    
    return newEntity.save();
}

function update(page) {
    return FbPage.findOneAndUpdate({ _id: page._id }, page);
}

function findAll() {
    return FbPage.find();
}

function findById(id) {
    return FbPage.findById(id);
}

function findByQuery(query) {
    return FbPage.find(query);
}

function remove(query) {
    return FbPage.findOneAndRemove(query);
}

module.exports = {
    create: create,
    update: update,
    findAll: findAll,
    findByQuery: findByQuery,
    findById: findById,
    remove: remove
}
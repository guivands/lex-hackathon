var Log = require('../models/log');
var self = Log;

function create(newObject) {
    var newEntity = new self();
    
    for(var key in self.schema.obj) {
        newEntity[key] = newObject[key];
    }
    
    return newEntity.save();
}

module.exports = {
    create: create
}
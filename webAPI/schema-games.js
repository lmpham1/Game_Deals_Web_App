var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gamesSchema = new Schema({
    gameName: {type: String, required: true},
    price: {type: Number, required: true},
    storeUrl: {type: String, required: true}
})

module.exports = gamesSchema;
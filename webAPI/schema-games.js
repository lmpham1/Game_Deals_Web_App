var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = require('./schema-comments');

var gamesSchema = new Schema({
    gameId: {type: String, required: true, unique: true},
    gameName: {type: String, required: false},
    views: {type: Number, required: false},
    comments: [Comments]
})

module.exports = gamesSchema;
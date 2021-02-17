// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Games = require('./schema-games')
var usersSchema = new Schema({
    userName: {type: String, required: true},
    fName: String,
    lName: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    theme: {type: String, default:"light"},
    wishlistedGames: [],
    searchHistory: []
});

module.exports = usersSchema;

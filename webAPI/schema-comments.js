var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./schema-users');

var commentsSchema = new Schema({
    comment: {type: String, required: true},
    date: {type: Date, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    userFName: {type: String, required: true},
    userLName: {type: String, required: true},
    upVote: {type: Number, default: 0},
    userLikes: [],
    userDislikes: [],
    downVote: {type: Number, default: 0},
})

module.exports = commentsSchema;
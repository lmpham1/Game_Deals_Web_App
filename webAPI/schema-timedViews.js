var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./schema-users');

var timedViewsSchema = new Schema({
    date: {type: Date, required: true},
    views: {type: Number, default: 0}
})

module.exports = timedViewsSchema;
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortly');

module.exports = mongoose;

module.exports.User = mongoose.model('User', {
  username: { type: String, unique: true },
  password: String
});

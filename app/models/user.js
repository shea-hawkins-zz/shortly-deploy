var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var cipher = Promise.promisify(bcrypt.hash);

var User = db.model('User', {
  username: { type: String, unique: true },
  password: String
});


module.exports = {
  create: function(username, password) {
    return this.hashPassword(password).then(function(hash) {
      return new Promise(function(resolve, reject) {
        var user = new User({username: username, password: hash});
        user.save(function(err) {
          err ? reject(err) : resolve(user);
        });
      });
    });
  },
  validate: function(username, password) {
    var user;
    return new Promise(function(resolve, reject) {
      User.findOne({ username: username }, 'username password', function(err, user) {
        err ? reject(err) : resolve(user);
      });
    })
    .then(function(result) {
      user = result;
      if (user) {
        return new Promise(function(resolve, reject) {
          bcrypt.compare(password, user.password, function(err, result) {
            err ? reject(err) : resolve(result);          
          });
        });
      } else {
        return false;
      }
    });
  }, 
  hashPassword: function(password) {
    return cipher(password, null, null);
  }
};

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
  local: {
    username: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    admin: false
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    admin: false
  },
  github: {
    id: String,
    token: String,
    email: String,
    name: String,
    admin: false
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  var bcrypt = require('bcryptjs');
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.local.password, salt, function(err, hash) {
          newUser.local.password = hash;
          newUser.save(callback);
      });
  });
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback); // findOne() is a mongoose function that takes query as argument
}

module.exports.getUserById = function(id, callback) {
  User.findOne(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if (err) throw err;
      callback(null, isMatch);
  });
}
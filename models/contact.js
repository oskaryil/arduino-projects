var mongoose = require('mongoose');

var ContactSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  subject: {
    type: String
  },
  message: {
    type: String
  }
});

var ContactMessage = module.exports = mongoose.model('ContactMessage', ContactSchema);
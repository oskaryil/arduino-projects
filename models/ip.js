var mongoose = require('mongoose');

var IPSchema = mongoose.Schema({
  ip: String,
  date: {
    type: Date,
    default: Date.now
  }
});

var IPLog = module.exports = mongoose.model('IPLog', IPSchema);
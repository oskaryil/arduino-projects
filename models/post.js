var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
  postTitle: String,
  components: String,
  description: String,
  imgUrl: String,
  author: Object,
});

var Post = module.exports = mongoose.model('Post', PostSchema);
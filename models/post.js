var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
  postTitle: String,
  components: String,
  description: {
    type: String,
    default: ""
  },
  imgUrl: String,
  author: Object,
});

var Post = module.exports = mongoose.model('Post', PostSchema);
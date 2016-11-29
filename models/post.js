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
  createdAt: {
    type: Date,
    default: Date.now
  },
  githubRepoUrl: String,
});

var Post = module.exports = mongoose.model('Post', PostSchema);
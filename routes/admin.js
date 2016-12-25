var express = require('express');
var router = express.Router();

var Post = require('../models/post');

const ensureAuth = require('../config/ensureAuth');

router.get('/', ensureAuth.ensureAdmin, function(req, res, next) {
  var db = req.db;
  var iplogsCollection = db.get('iplogs');
  var uniqueVisitors = 0;
  iplogsCollection.find({}, {}, function(e, docs) {
    uniqueVisitors = docs.length;
    res.render('admin/admin', {
      title: 'Arduino Projects | Admin Dashboard',
      layout: 'dashboard-layout',
      script: 'admin',
      uniqueVisitors: uniqueVisitors
    });
  });
});

router.get('/users', ensureAuth.ensureAdmin, function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');

  collection.find({}, {}, function(e, docs) {
    res.render('admin/users', {
      layout: 'dashboard-layout',
      script: 'admin',
      title: 'Users | Admin Dashboard',
      users: docs.reverse()
    });
  });
});

router.get('/posts', ensureAuth.ensureAdmin, function(req, res, next) {

  var db = req.db;
  var collection = db.get('posts');

  collection.find({}, {}, function(e, posts) {
    res.render('admin/posts', {
      layout: 'dashboard-layout',
      script: 'admin-posts',
      title: 'Posts | Admin Dashboard',
      posts: posts.reverse()
    });
  });

});

router.post('/posts/deletePost', ensureAuth.ensureAdmin, function(req, res) {
  console.log(req.body);

  var checkedPostsId = req.body[0] || "";
  checkedPostsId.forEach(function(id) {
    Post.remove({_id: id}, function(err) {
      if(err) {
        res.send({'success': false});
        console.log('A mongoose error occured');
        console.error(err);
        return;
      }
    });
  });

  res.send({'success': true});

});

module.exports = router;
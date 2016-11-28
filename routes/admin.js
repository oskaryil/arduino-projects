var express = require('express');
var router = express.Router();

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

router.get('/users', function(req, res, next) {
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

router.get('/posts', function(req, res, next) {

  var db = req.db;
  var collection = db.get('posts');

  collection.find({}, {}, function(e, posts) {
    res.render('admin/posts', {
      layout: 'dashboard-layout',
      scripts: 'admin-posts',
      title: 'Posts | Admin Dashboard',
      posts: posts.reverse()
    });
  });

});

module.exports = router;
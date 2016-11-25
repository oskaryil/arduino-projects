var express = require('express');
var router = express.Router();

router.get('/posts', function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  collection.find({}, {}, function(e, docs) {
    res.send(docs.reverse());
  });
});

router.get('/users', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');

  collection.find({}, {}, function(e, docs) {
    res.send(docs.reverse());
  });
});

router.get('/user-posts', function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  collection.find({"author.id": req.user.id}, {}, function(e, docs) {
    console.log(docs);
    res.send(docs.reverse());
  });
});

module.exports = router;

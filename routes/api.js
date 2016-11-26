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
    res.send(docs.reverse());
  });
});

router.post('/remove-post', function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  var postID = req.body.postID;
  collection.findOne({"_id": postID}, {}, function(e, doc) {
    if(doc.author.id === req.user.id) {
      collection.remove({"_id": postID}, function(err, result) {
        if(err) {
          console.log(err);
          res.send({'success': false});
        }
        res.send({'success': true});
        db.close();
      });
    } else {
      res.send('invalid user');
    }
  });
});

module.exports = router;

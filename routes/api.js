var express = require('express');
var moment = require('moment');
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

router.get('/new-users-today', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');
  var newUsers = 0;

  collection.find({}, {}, function(e, docs){
    docs.forEach(function(user) {
      const createdDate = moment(user.createdAt).format("YYYY-MM-DD");
      const currentDate = moment().format("YYYY-MM-DD");
      if(currentDate === createdDate) {
        newUsers++;
      }
    });
    res.send(newUsers.toString());
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

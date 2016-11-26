var express = require('express');
var passport = require('passport');
var router = express.Router();

var ensureAuth = require('../config/ensureAuth');

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res, next) {
    res.redirect(ensureAuth.hasUsername(req, res, next));
  });

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res, next) {
    res.redirect(ensureAuth.hasUsername(req, res, next));
  });

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res, next) {
    res.redirect(ensureAuth.hasUsername(req, res, next));
});

router.get('/pick-username', ensureAuth.noUsername, function(req, res, next) {
  res.render('pick-username', {
  });
});

router.post('/pick-username', function(req, res, next) {
  var username = req.body.username;
  var currentUser = req.user;
  var usernameExists = false;

  currentUser.username = username;

  var db = req.db;
  var collection = db.get('users');

  collection.find({}, {}, function(e, docs) {
    // console.log(docs);
    docs.forEach(function(user) {
      console.log(user.username);
      if(user.username == username) {
        console.log('UsernameExists set to TRUE');
        usernameExists = true;
      }
    });
    if(!usernameExists) {  
    collection.findOne({_id: req.user._id}, function(e, user) {
      collection.update({'username': user.username}, {$set:{'username': username}}, function(err, object) {
        console.log('collection update');
        if(err) {
          console.warn(err.message);
        } else {
          res.redirect('/profile');
        }
      });
    });  
  } else {
    console.log('fail');
    req.flash('error_msg', 'Username already exists.');
    res.redirect('/auth/pick-username');
  }
  });


});

module.exports = router;
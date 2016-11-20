var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GithubStrategy = require("passport-github").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var dotenv = require('dotenv').config();
var aws = require('aws-sdk');
var S3_BUCKET = process.env.S3_BUCKET;


var User = require('../models/user');
var Post = require('../models/post');

var currentUser;
var imgLink;

const config = require('../config.json');

router.get('/sign-s3', function(req, res) {
  var s3 = new aws.S3({signatureVersion: 'v4', region: 'eu-central-1'});
  var fileName = req.query['file-name'];
  var fileType = req.query['file-type'];
  console.log(fileName);
  console.log(fileType);

  fileName = fileName.replace(/\s+/g, '-');

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 9999,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, function(err, data) {
    if(err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    }
    imgLink = returnData.url || "";
    res.write(JSON.stringify(returnData));
    res.end();
  });
});


router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Arduino Projects',
    script: 'main'
	});
});

router.get('/new-project', ensureAuthenticated, function(req, res, next) {
  res.render('post-project', {
    title: 'Arduino Projects | Upload a new project',
    script: 'newproject'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Arduino Projects | Login',
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', {
    title: 'Arduino Projects | About',
  });
});

router.get('/locallogin', function(req, res, next) {
  res.render('local-login', {
    title: 'Arduino Porjects | Login'
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Arduino Projects | Sign up',
  });
});

router.get('/posts/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  collection.findOne({_id: req.params.id}, function(e, post) {
    res.render('post', {
      title: post.postTitle + ' | Arduino Projects',
      post: post,
    });
  });
});

router.get('/admin', ensureAdmin, function(req, res, next) {
  res.render('admin', {
    title: 'Arduino Projects | Admin Dashboard',
    layout: 'dashboard-layout',
    script: 'admin',
  });
});

router.get('/api/posts', function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  collection.find({}, {}, function(e, docs) {
    res.send(docs.reverse());
  });
});

router.get('/api/users', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');

  collection.find({}, {}, function(e, docs) {
    console.log(docs);
    res.send(docs.reverse());
  });
});

router.get('/api/user-posts', function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  collection.find({"author.id": req.user.id}, {}, function(e, docs) {
    console.log(docs);
    res.send(docs.reverse());
  });
});

router.post('/upload-project', function(req, res, next) {
  var projectName = req.body.postTitle;
  console.log(projectName);
  var components = req.body.components;
  var description = req.body.projectDescription;
  var githubRepoLink = req.body.githubRepoLink;
  var author = {
    id: req.user.id || "",
    name: req.user.username || req.user.facebook.name || req.user.google.name || req.user.github.name,
  };  

  var newPost = new Post();
  newPost.postTitle = projectName;
  newPost.components = components;
  newPost.description = description;
  newPost.author = author;
  newPost.imgUrl = imgLink || "";
  newPost.githubRepoUrl = githubRepoLink || "";
  newPost.save(function(err) {
    if (err) throw err;
  });

  console.log(newPost);

});

router.post('/locallogin',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect:'/login',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect('/profile');
});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User();
    newUser.local.name = name;
    newUser.local.email = email;
    newUser.local.username = username;
    newUser.local.password = password;

    User.createUser(newUser, function(err, user) {
      if(err) throw err;
    });

    req.flash('success_msg', 'You are registered and can now log in');
    res.redirect('/profile');
  }

});

router.get('/logout', function(req, res, next) {
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
  res.render('profile', {
    title: 'Arduino Projects | Profile',
    script: 'profile',
    user: req.user,
  });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile',
                                      failureRedirect: '/login' }));

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/profile',
                                      failureRedirect: '/login' }));

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/profile',
                                      failureRedirect: '/login' }));

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Please Login to access your profile');
        res.redirect('/login');
    }
}

function ensureAdmin(req, res, next) {
  if(req.isAuthenticated()) {
    if(req.user.admin) {
      return next();
    }
  } else {
    req.flash('error_msg', 'You need to be an admin to access this page.');
    res.redirect('/');
  }
}

module.exports = router;
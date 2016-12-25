var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GithubStrategy = require("passport-github").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var dotenv = require('dotenv').config();
var aws = require('aws-sdk');
var moment = require('moment');
var S3_BUCKET = process.env.S3_BUCKET;


var User = require('../models/user');
var Post = require('../models/post');
var IPLog = require('../models/ip');
var ensureAuth = require('../config/ensureAuth');

// var currentUser;
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
  var db = req.db;
  var collection = db.get('iplogs');
  var ip = req.connection.remoteAddress

  collection.findOne({ "ip": ip }, function(e, doc) {
    if(!doc) {
      var newIP = new IPLog();
      newIP.ip = ip;
      newIP.save(function(err) {
        if(err) throw err;
      });
    }
  });

  res.render('index', {
    title: 'Explore and Share Interesting Projects',
    script: 'main'
  });

});

router.get('/new-project', ensureAuth.ensureAuthenticated, function(req, res, next) {
  res.render('post-project', {
    title: 'Arduino Projects | Upload a new project',
    script: 'newproject'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Arduino Projects | Login',
    script: 'login-page'
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

router.get('/contact', function(req, res, next) {
  res.render('contact', {
    title: 'Arduino Projects | Contact',
    script: 'contact'
  });
});

router.get('/posts/:id', function(req, res, next) {

  var db = req.db;
  var collection = db.get('posts');

  collection.findOne({_id: req.params.id}, function(e, post) {
    res.render('post', {
      title: post.postTitle + ' | Arduino Projects',
      post: post,
      script: 'post'
    });
  });
});

router.get('/posts/:id/edit', ensureAuth.ensureAuthenticated, function(req, res, next) {
  

  var db = req.db;
  var collection = db.get('posts');

  collection.findOne({_id: req.params.id}, function(e, post) {
    if(req.user.id === post.author.id || req.user.admin) {
      res.render('edit-post', {
        title: 'Edit | ' + post.postTitle + ' | Arduino Projects',
        post: post,
        script: 'edit-post'
      });
    } else {
      res.render('invalid-user-error');
    }
  });
});


router.post('/posts/:id/edit-project', ensureAuth.ensureAuthenticated, function(req, res) {
  var db = req.db;
  var collection = db.get('posts');

  var projectName = req.body.postTitle;
  var components = req.body.components;
  var description = req.body.projectDescription;
  var githubRepoLink = req.body.githubRepoLink;
  var youtubeLink = req.body.youtubeLink;
  var author = {
    id: req.user.id || "",
    name: req.user.name || req.user.facebook.name || req.user.google.name || req.user.github.name,
    username: req.user.username,
    email: req.user.email
  };  

  req.checkBody('postTitle', 'A project title is required').notEmpty();
  req.checkBody('components', 'At least one component is required.').notEmpty();
  req.checkBody('projectDescription', 'Description can not be empty.').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('post-project', {
      title: 'Arduino Projects | Upload a new project',
      script: 'newproject',
      errors: errors
    });
  } else {
    collection.findOne({_id: req.params.id}, function(e, post) {
      collection.update({'postTitle': post.postTitle, 'components': post.components, 'description' : post.description, 'githubRepoLink': post.githubRepoLink, 'youtubeLink' : post.youtubeLink}, {$set:{'postTitle': projectName, 'components': components, 'description' : description, 'githubRepoLink':  githubRepoLink, 'youtubeLink' : youtubeLink}}, function(err, object) {
        console.log('collection update');
        if(err) {
          console.warn(err.message);
        } else {
          res.redirect('/profile');
        }
      });
    });  
    req.flash('success_msg', 'Your project has been successfully updated');
    res.redirect('/profile');
  }
});

router.post('/upload-project', function(req, res, next) {
  var projectName = req.body.postTitle;
  var components = req.body.components;
  var description = req.body.projectDescription;
  var githubRepoLink = req.body.githubRepoLink;
  var youtubeLink = req.body.youtubeLink;
  var author = {
    id: req.user.id || "",
    name: req.user.name || req.user.facebook.name || req.user.google.name || req.user.github.name,
    username: req.user.username,
    email: req.user.email
  };  

  req.checkBody('postTitle', 'A project title is required').notEmpty();
  req.checkBody('components', 'At least one component is required.').notEmpty();
  req.checkBody('projectDescription', 'Description can not be empty.').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('post-project', {
      title: 'Arduino Projects | Upload a new project',
      script: 'newproject',
      errors: errors
    });
  } else {
    var newPost = new Post();
    newPost.postTitle = projectName;
    newPost.components = components;
    newPost.description = description;
    newPost.author = author;
    newPost.imgUrl = imgLink || "";
    newPost.githubRepoUrl = githubRepoLink || "";
    newPost.youtubeLink = youtubeLink || "";
    newPost.save(function(err) {
      if (err) throw err;
    });
    req.flash('success_msg', 'Your project has been uploaded successfully');
    res.redirect('/');
  }


});

router.post('/locallogin',
  passport.authenticate('local', {
    failureRedirect:'/login',
    failureFlash: true
  }),
  function(req, res, next) {
    res.redirect(ensureAuth.hasUsername(req, res, next));
});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  // var db = req.db;
  // var collection = db.get('users');

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  // req.checkBody('username', 'Username already exists').usernameExists(username);
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
    newUser.email = email;
    newUser.name = name;
    newUser.username = username;
    newUser.local.username = username;
    newUser.local.password = password;
    newUser.ip = req.connection.remoteAddress;

    User.createUser(newUser, function(err, user) {
      if(err) return next(err);
      
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

router.get('/profile', ensureAuth.ensureAuthenticated, function(req, res, next) {
  var db = req.db;
  var collection = db.get('posts');

  collection.find({"author.id": req.user.id}, {}, function(e, docs) {
    res.render('profile', {
      title: 'Arduino Projects | Profile',
      script: 'profile',
      user: req.user,
      stylesheet: 'profile',
      posts: docs.reverse()
    });
    
  });
});


module.exports = router;
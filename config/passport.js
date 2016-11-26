var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GithubStrategy = require("passport-github").Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');


module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // passport.use('local-signup', new LocalStrategy({
  //   username: 'username',
  //   passwordField: 'password',
  //   passReqToCallback: true
  // },
  // function(req, username, password, done) {

  // }
  // ));

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
        if(err) throw err;
        if(!user) {
          return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.local.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
              return done(null, user);
          } else {
            return done(null, false, {message: 'Invalid password'});
          }
        });
      });
  }));

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          User.findOne({'facebook.id': profile.id}, function(err, user){
            if(err)
              return done(err);
            if(user)
              return done(null, user);
            else {
              var newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.facebook.token = accessToken;
              newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.facebook.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.save(function(err){
                if(err)
                  throw err;
                return done(null, newUser);
              })
              console.log(profile);
            }
          });
        });
      }

  ));

passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          User.findOne({'google.id': profile.id}, function(err, user){
            if(err)
              return done(err);
            if(user) 
              return done(null, user);
            else {
              var newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = accessToken;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.name= profile.displayName;
              newUser.imgUrl = profile.photos[0].value;
              newUser.save(function(err){
                if(err)
                  throw err;
                return done(null, newUser);
              })
              console.log(profile);
            }
          });
        });
      }

  ));

passport.use(new GithubStrategy({
      clientID: configAuth.githubAuth.clientID,
      clientSecret: configAuth.githubAuth.clientSecret,
      callbackURL: configAuth.githubAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          User.findOne({'github.id': profile.id}, function(err, user){
            if(err)
              return done(err);
            if(user)
              return done(null, user);
            else {
              var newUser = new User();
              newUser.github.id = profile.id;
              newUser.github.token = accessToken;
              newUser.github.name = profile.displayName;
              newUser.github.email = profile.emails[0];
              newUser.name = profile.displayName;
              newUser.email = profile.emails[0];
              newUser.imgUrl = profile.photos[0];
              newUser.username = profile.username;
              newUser.save(function(err){
                if(err)
                  throw err;
                return done(null, newUser);
              })
              console.log(profile);
            }
          });
        });
      }

  ));


};
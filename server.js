var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var GithubStrategy = require("passport-github").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arduinoprojects');
var db = mongoose.connection;

const config = require('./config.json');

// New code
var monk = require('monk');
var db = monk('localhost:27017/arduinoprojects');

var routes = require('./routes/index');
// var admin = require('./routes/admin');

var app = express();

const viewdir = __dirname + '/views/';
const partialsdir = __dirname+'/views/partials/';
const basedir = __dirname + '/public/';

app.set('views', viewdir);
app.set('partials', partialsdir);
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  helpers: {
    get_name: config.site.name
  }
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); // Support JSON Encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // Support encoded bodies
app.use(cookieParser()); // Use cookieparser
app.use(express.static(basedir));

// Express Session
app.use(session({
  secret: 'arduinoprojects',
  saveUninitialized: true,
  resave: true
}));

// Passport init
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use('/', routes);
// app.use('/admin', admin);

// catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.set('port', (process.env.PORT || config.site.port));

app.listen(app.get('port'), function() {
	console.log(config.site.name + " running on port " + app.get('port'));
});




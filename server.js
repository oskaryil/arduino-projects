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
var morgan = require('morgan'); // logger
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arduinoprojects');
var db = mongoose.connection;

const config = require('./config.json');

// New code
var monk = require('monk');
var db = monk('localhost:27017/arduinoprojects');

var routes = require('./routes/index');
var authRoutes = require('./routes/auth');
var apiRoutes = require('./routes/api');
var adminRoutes = require('./routes/admin');
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
    get_name: config.site.name,
    has_analytics: function(opts) {
      const fnTrue = opts.fn;
      const fnFalse = opts.inverse  ;
      return (config.site.analytics && config.site.analytics !== false) ? fnTrue() : fnFalse();
    },
    get_analytics: function(opts) {
      if (config.site.analytics) {
        return config.site.analytics;
      }
    },
    get_currentYear: function() {
      return new Date().getFullYear();
    }
  }
}));
app.set('view engine', 'handlebars');

if(process.env.NODE_ENV = 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json()); // Support JSON Encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // Support encoded bodies
app.use(cookieParser()); // Use cookieparser
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/assets',express.static(path.join(__dirname, 'public/assets')));

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
  },
  customValidators: {
    usernameExists: function(username) {
      var collection = db.get('users');

      collection.findOne({"username": username}, function(e, doc) {
        console.log(e);
        console.log(docs);

        if(docs.length > 0) {
          return true;
        } else if(docs.error === true) {
          console.log('return false');
          return false;
        }
      });
    }
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


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
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




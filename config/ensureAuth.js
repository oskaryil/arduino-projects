module.exports.ensureAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()) {
    if(req.user.username) {
      return next();
    } else {
      // req.flash('error_msg', 'You need to pick a username for full functionality.');
      // console.log('REDIRECT: PICK-USERNAME');
      // res.redirect('/auth/pick-username');
      console.log('no username detected');
      res.redirect('/auth/pick-username');
    }
  } else {
    req.flash('error_msg', 'Please Login to access your profile');
    res.redirect('/login');
  }
}

module.exports.hasUsername = function(req, res, next) {
  if(req.isAuthenticated()) {
    if(req.user.username) {
      return '/profile';
    } else {
      return '/auth/pick-username';
    }
  } 
}

module.exports.noUsername = function(req, res, next) {
  if(req.isAuthenticated()) {
    if(!req.user.username) {
      return next();
    } else {
      res.redirect('/profile');
    }
  }
}
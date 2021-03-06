var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require('../db.js');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.retrieveUserByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }

      bcrypt.compare(password, user.password, function(err, res) {
          if (err) return cb(err);
          if (res === false) {
            return cb(null, false);
          } else {
            return cb(null, user);
          }
      });

    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.retrieveUserId(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

router.get('/login',function(req, res){
  res.render('login');
});

router.post('/login',   passport.authenticate('local', { failureRedirect: '/login' }), function(req, res, next) {
  res.redirect('/home');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*
 * POST /register
 * Purpose: To persist a user's account to save their data
 * Process:
 *    1) Verify post payload has a username and password property
 *      - if not, return with an error
 *    2) Verify that the password is at least 8 characters but not more than 75
 *      - if not, return with an error
 *    3) Verify that the username isn't taken
 *      - if not, return with an error
 *    4) If all the above conditions hold, save the user into the database with a salted password 
 *       and redirect the user agent to the home screen
 */
router.post('/register',function(req,res){
  if (!req.body.username || !req.body.password) {
     res.render('register', {error:'You need a username and a password to register.'}); 
     return
  }
   
  if (req.body.password.length < 8 || req.body.password.length > 75) {
    return res.render('register', {error:'Sorry, you password must be between 8 and 75 characters.'}); 
  }
 
  db.retrieveUserByUsername(req.body.username, function(err, user){
    if(user) {
      return res.render('register', {error:'Sorry! That username is already in use.'}); 
    }
     
    if(err) {
      return next(err);
    }
       
    bcrypt.genSalt(10, function(err, salt){
      if (err) {
        return next(err);
      }
     
      bcrypt.hash(req.body.password, salt, function(err, hash){
        if (err) {
          return next(err);
        }
       
        var newUser = {username: req.body.username, password: hash};
        
        db.storeUser(newUser, function(err, result){
          return res.redirect('/home'); 
        });

      });
    });

  });
});

module.exports = router;

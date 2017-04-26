var express = require('express');
var passport = require('passport');
var session = require('express-session');
var redis = require("redis");
var client = redis.createClient();
var config = require('./config.js');

var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'pug')

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', 
                  resave: true, 
                  saveUninitialized: true
}));

// Create a new Express application.
app.use(passport.initialize());
app.use(passport.session());

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


// Register all the passport authentication routes
config.authProviders.forEach((provider) => {
  var routes = require('./passport/' + provider + '.js');
  app.use(routes)
});

// Define routes.
app.get('/home', loggedIn, function(req, res) {
  res.render('home', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login');
});


app.listen(3000);
console.log('Listening on port 3000...');

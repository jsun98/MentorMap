var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../passport/models/user');

// =====================================
// HOME PAGE =====================
// =====================================
router.get('/', function(req, res, next) {
  //console.log(req.flash('loginMessage'));
  res.render('index', { title: 'Express' });
});

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

// =====================================
// Complete signup =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.post('/mentee-complete',isLoggedIn, function(req, res, next) {
  User.findOne({ 'profile.email': req.user.profile.email }, function (err, user) {
    if (err) res.status(500).send(err);
    console.log(user);
  })
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;

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
  User.findOne({ 'email': req.user.email }, function (err, user) {
    if (err) res.status(500).send(err);

    if (!user) res.status(500).send("User Not Found!");

    /*
    user.profile.gender               = req.body.gender;
    user.profile.phone                = req.body.phone;
    user.profile.avg_11               = req.body.avg_11;
    user.profile.avg_12               = req.body.avg_12;
    user.profile.high_school          = req.body.high_school;
    user.profile.grade                = req.body.grade;
    user.profile.skills               = req.body.skills;//might need to push
    user.profile.linkedin             = req.body.linkedin;
    user.profile.paragraphs           = req.body.paragraphs;//might need to push
    user.profile.high_school_programs = req.body.high_school_programs;//might need to push
    user.profile.preferred_program    = req.body.preferred_program;//might need to push
    user.profile.preferred_school     = req.body.preferred_school;//might need to push
    */

    console.log(user);

    res.render('profile', {
        user : req.user
    });
  });
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

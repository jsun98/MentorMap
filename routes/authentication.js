var express = require('express');
var router = express.Router();
var passport = require('passport');

// =====================================
// LOGIN ===============================
// =====================================

// process the login form
router.post('/login', passport.authenticate('user-login', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// =====================================
// SIGNUP ==============================
// =====================================

// process the signup form
router.post('/signup', passport.authenticate('user-signup', {
    successRedirect : '/auth/logout', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true, // allow flash messages
    successFlash: 'Welcome to MentorMap! We Have Sent You An Email With A Verification Link. You Must Verify Your Email Before Accessing Your Account.'
}));

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

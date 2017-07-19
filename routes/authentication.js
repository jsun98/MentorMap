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
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

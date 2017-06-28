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
  req.body.skills = req.body.skills.split(',');
  console.log(req.body);




  User.findByIdAndUpdate(req.user.id, {
    $set:
      { 'profile.gender' : req.body.gender,
        'profile.phone' : req.body.phone,
        'profile.avg_11' : parseInt(req.body.avg_11),
        'profile.avg_12' : parseInt(req.body.avg_12),
        'profile.high_school' : req.body.high_school,
        'profile.grade' : parseInt(req.body.grade),
        'profile.skills' : req.body.skills,
        'profile.linkedin' : req.body.linkedin,
        'profile.paragraphs' : req.body.paragraphs,
        'profile.high_school_programs': req.body.high_school_programs,
        'profile.preferred_program' : req.body.preferred_program,
        'profile.preferred_school' : req.body.preferred_school
     }
    },
    function (err, tank) {
      if (err) console.error(err);

      res.render('profile', {
          user : req.user
      });

    }
  );

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

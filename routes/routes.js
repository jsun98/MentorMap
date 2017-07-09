var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../passport/models/user');


// =====================================
// HOME PAGE =====================
// =====================================
router.get('/', function(req, res, next) {
  //console.log(req.flash('loginMessage'));
  res.render('index', { user: req.user});

});

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/register', isLoggedIn, function(req, res, next) {
    if (req.user.completed)
      res.redirect('/profile');
    res.render('register', {
        user : req.user // get the user out of session and pass to template
    });
});


// =====================================
// Complete signup =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)

router.post('/mentee-complete', isLoggedIn, function(req, res, next) {

  if (req.user.completed) {
    var err = new Error("Already Completed");
    next(err);
  }

  req.body.skills = req.body.skills.split(',');

  if (req.body.high_school_program.constructor !== Array)
    req.body.high_school_program = [req.body.high_school_program];
  if (req.body.preferred_program.constructor !== Array)
    req.body.preferred_program = [req.body.preferred_program];
  if (req.body.preferred_school.constructor !== Array)
    req.body.preferred_school = [req.body.preferred_school];

  User.findByIdAndUpdate(req.user.id, {
    $set:
      { 'completed' : true,
        'profile.gender' : req.body.gender,
        'profile.phone' : req.body.phone,
        'profile.age' : req.body.age,
        'profile.avg_11' : parseInt(req.body.avg_11),
        'profile.avg_12' : parseInt(req.body.avg_12),
        'profile.high_school' : req.body.high_school,
        'profile.grade' : parseInt(req.body.grade),
        'profile.skills' : req.body.skills,
        'profile.linkedin' : req.body.linkedin,
        'profile.paragraphs' : req.body.paragraphs,
        'profile.high_school_program': req.body.high_school_program,
        'profile.preferred_program' : req.body.preferred_program,
        'profile.preferred_school' : req.body.preferred_school
     }
    },
    function (err, tank) {
      if (err) console.error(err);

    }
  );
  res.redirect('/profile');

});

router.post('/mentor-complete',isLoggedIn, function(req, res, next) {

  if (req.user.completed) {
    var err = new Error("Already Completed");
    next(err);
  }

  req.body.skills = req.body.skills.split(',');
  if (req.body.high_school_program.constructor !== Array)
    req.body.high_school_program = [req.body.high_school_program];

  User.findByIdAndUpdate(req.user.id, {
    $set:
      { 'completed' : true,
        'profile.gender' : req.body.gender,
        'profile.phone' : req.body.phone,
        'profile.high_school_program': req.body.high_school_program,
        'profile.skills' : req.body.skills,
        'profile.linkedin' : req.body.linkedin,
        'profile.paragraphs' : req.body.paragraphs,
        'profile.gpa' : parseInt(req.body.gpa),
        'profile.age' : req.body.age,
        'profile.curr_school' : req.body.curr_school,
        'profile.curr_major' : req.body.curr_major,
        'profile.curr_minor' : req.body.curr_minor,
        'profile.grad_year' : parseInt(req.body.grad_year)
     }
    },
    function (err, tank) {
      if (err) console.error(err);

    }
  );
  res.redirect('/profile');

});

// =====================================
// Dashboard Profile Pages  =====================
// =====================================
router.get('/profile', isLoggedIn, isRegCompleted, function(req, res, next) {
  res.render('profile', { user: req.user });
});

// =====================================
// Inbox Page  =====================
// =====================================
router.get('/inbox', isLoggedIn, isRegCompleted, function(req, res, next) {
  res.render('inbox', { user: req.user });
});


// =====================================
// List all Mentor/Mentee  =====================
// =====================================

router.get('/mentors-list', isLoggedIn, isRegCompleted, function(req, res, next) {
  User.find({
    role: "mentor",
    completed: true
  }, function (err, profiles) {
    if (err)
      console.error(err);
    else {
      res.render('profile_list', { user: req.user, profiles: profiles });
    }
  });
});

// =====================================
// Mentor/Mentee Profile Details  =====================
// =====================================
router.get('/mentor-details', isLoggedIn, isRegCompleted, function(req, res, next) {
  User.findById(req.query.id, function (err, mentor){
    if (err)
      console.error(err);
    else {
      res.render('mentor-details', { user: req.user, mentor: mentor });
    }
  });
});

function isRegCompleted (req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.user.completed)
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/register');
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;

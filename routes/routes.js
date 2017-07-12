var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../passport/models/user');
var random = require('mongoose-random');

//set up the Mongoose-Random plugin
User.syncRandom(function (err, result) {
  if (err)
    console.log(err);
});

// =====================================
// Index PAGE =====================
// =====================================
router.get('/', function(req, res, next) {
  //console.log(req.flash('loginMessage'));
  res.render('index', { user: req.user});

});

// =====================================
// Register =====================
// =====================================
// Directs user to complete his/her registeration
router.get('/register', isLoggedIn, function(req, res, next) {
    if (req.user.completed) {
      res.redirect('/dashboard');
    }
    if (req.user.role === "mentee")
      res.render('mentee_register', {user : req.user});
    else
      res.render('mentor_register', {user : req.user});
});

//update mentee database records
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
      if (err)
        next(err);

    }
  );
  res.redirect('/dashboard');

});

//update mentor database records
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
      if (err)
        next(err);

    }
  );
  res.redirect('/dashboard');

});

// =====================================
// Dashboard Page  =====================
// =====================================
router.get('/dashboard', isLoggedIn, isRegCompleted, function(req, res, next) {
  if (req.user.role === "mentee")
    res.render('mentee_dashboard', { user: req.user });
  else {
    res.render('mentor_dashboard', { user: req.user });
  }
});

// =====================================
// Inbox Page  =====================
// =====================================
router.get('/inbox', isLoggedIn, isRegCompleted, function(req, res, next) {
  res.render('inbox', { user: req.user });
});

// =====================================
// Session Booking Page  =====================
// =====================================
router.get('/booking', isLoggedIn, isRegCompleted, isMentorOnly, function(req, res, next) {
  if (!req.query.id)
    next(new Error("Unable to Fetch Profile Data"));
  User.findById(req.query.id, function (err, mentee){
    if (err)
      next(err);
    res.render('session_booking', { user: req.user, mentee: mentee });
  });
});

router.post('/booking', isLoggedIn, isRegCompleted, isMentorOnly, function(req, res, next) {
  console.log(req.body);

//might wanna change this to promise
/*
  User.update({_id: req.body.mentee_id}, { $addToSet: { 'upcomingSessions' : req.user._id }}, function (err) {
    if (err)
      next(err);
    else {
      User.update({_id: req.user._id}, { $addToSet: { 'mentors' : req.body.mentor_id }}, function (err) {
        if (err)
          next(err);
        else
          res.send('success');
      });
    }
  });
  */
});

// =====================================
// List all the mentors's current mentees =====================
// =====================================
router.get('/mymentees', isLoggedIn, isRegCompleted, isMentorOnly, function(req, res, next) {
  User.findById(req.user._id)
    .populate('mentees')
    .exec(function (err, user) {
      if (err)
        next(err);
      res.render('profile_list', { user: req.user, profiles: user.mentees });
    });
});

// =====================================
// List all the mentees's current mentor =====================
// =====================================
router.get('/mymentors', isLoggedIn, isRegCompleted, isMenteeOnly, function(req, res, next) {
  User.findById(req.user._id)
    .populate('mentors')
    .exec(function (err, user) {
      if (err)
        next(err);
      res.render('profile_list', { user: req.user, profiles: user.mentors });
    });
});

// =====================================
// Mentor list page =====================
// =====================================

router.get('/mentor-list', isLoggedIn, isRegCompleted, function(req, res, next) {

  User.findRandom({
    role: "mentor",
    completed: true,
    mentees: { "$ne": req.user._id }
  }, function (err, profiles) {
    if (err)
      next(err);
    else {
      res.render('profile_list', { user: req.user, profiles: profiles });
    }
  }).limit(6);

});

// =====================================
// Mentor profile details  =====================
// =====================================
router.get('/mentor-details', isLoggedIn, isRegCompleted, function(req, res, next) {
  if (!req.query.id)
    next(new Error("Unable to Fetch Profile Data"));
  User.findById(req.query.id, function (err, mentor){
    if (err)
      next(err);
    if (mentor.mentees.indexOf(req.user._id) != -1)
      res.render('mentor_profile_details', { user: req.user, mentor: mentor, matched: true });
    else
      res.render('mentor_profile_details', { user: req.user, mentor: mentor, matched: false });

  });
});

// Mentees choose mentor
router.post('/choose-mentor', isLoggedIn, isRegCompleted, isMenteeOnly, function(req, res, next) {

  //might wanna change this to promise
    User.update({_id: req.body.mentor_id}, { $addToSet: { 'mentees' : req.user._id }}, function (err) {
      if (err)
        next(err);
      else {
        User.update({_id: req.user._id}, { $addToSet: { 'mentors' : req.body.mentor_id }}, function (err) {
          if (err)
            next(err);
          else
            res.send('success');
        });
      }
    });

});

// =====================================
// Auxillary Functions =====================
// =====================================

function isMentorOnly (req, res, next) {
  if (req.user.role === "mentor")
    return next();

  res.redirect('/dashboard');
}

function isMenteeOnly (req, res, next) {
  if (req.user.role === "mentee")
    return next();

  res.redirect('/dashboard');
}

//checks if registration is completed
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

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../passport/models/user');
var Session = require('../passport/models/session');
var random = require('mongoose-random');


router.use(function (req, res, next) {
  if (req.isAuthenticated() && !req.user.verified)
    req.logout();
  next();
});

// =====================================
// verify =====================
// =====================================
// verify if email is correct
router.get('/verify', function(req, res, next) {
  console.log(req.query.id);
  User.findByIdAndUpdate(req.query.id, {
    $set: { 'verified' : true }
  }, function (err, user) {
    if (err)
      next(err);
    console.log(user);
    res.redirect('/');
  });
});

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
  User.findById(req.user._id)
    .populate('upcomingSessions')
    .populate({
     path: 'upcomingSessions',
     populate: {
       path: 'mentor',
       model: 'User'
     }
    })
    .populate({
     path: 'upcomingSessions',
     populate: {
       path: 'mentee',
       model: 'User'
     }
    })
    .sort({"upcomingSessions.date": -1})
    .exec(function (err, user) {
      if (err)
        next(err);
      user.upcomingSessions.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      });
      if (req.user.role === "mentee")
        res.render('mentee_dashboard', { user: user });
      else {
        res.render('mentor_dashboard', { user: user });
      }
    });


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
  if (!req.query.mentee_id && !req.query.session_id)
    next(new Error("Unable to Fetch Booking Page Data"));
  if (req.query.mentee_id) {
    User.findById(req.query.mentee_id, function (err, mentee){
      if (err)
        next(err);
      res.render('session_booking', { user: req.user, mentee: mentee, session: '' });
    });
  } else {
    Session.findById(req.query.session_id)
      .populate('mentee')
      .exec(function (err, session){
        if (err)
          next(err);
        console.log(typeof session.date);
        res.render('session_booking', { user: req.user, mentee: session.mentee, session: session });
      });
  }
});

router.post('/booking', isLoggedIn, isRegCompleted, isMentorOnly, function(req, res, next) {

  if (req.body.session_id) {

    Session.findByIdAndUpdate(req.body.session_id, {
      $set:
        {
          'creation_date' : new Date(),
          'type' : req.body.type,
          'purpose' : req.body.purpose,
          'date' : new Date(req.body.date),
          'startTime' : req.body.startTime,
          'endTime' : req.body.endTime,
          'mentor ': req.user._id,
          'mentee' : req.body.mentee_id
        }
      },
      function (err) {
        if (err)
          next(err);
        res.end();
      });

  } else {
    var newSession = new Session();
    newSession.creation_date = new Date();
    newSession.type = req.body.type;
    newSession.purpose = req.body.purpose;
    newSession.date = new Date(req.body.date);
    newSession.startTime = req.body.startTime;
    newSession.endTime = req.body.endTime;
    newSession.mentor = req.user._id;
    newSession.mentee = req.body.mentee_id;

    // save the session
    newSession.save(function(err, savedSession) {
      if (err)
        next(err);
      User.update({_id: req.body.mentee_id}, { $addToSet: { 'upcomingSessions' : savedSession._id }}, function (err) {
        if (err)
          next(err);
        else {
          User.update({_id: req.user._id}, { $addToSet: { 'upcomingSessions' : savedSession._id }}, function (err) {
            if (err)
              next(err);
            else
              res.send('Created New Session').end();
          });
        }
      });
    });
  }




});

router.post('/cancelBooking', isLoggedIn, isRegCompleted, isMentorOnly, function(req, res, next) {

  Session.findById(req.body.session_id)
    .populate('mentee')
    .populate('mentor')
    .exec(function (err, session) {
      if (err)
        next(err);
      var menteeSessions = session.mentee.upcomingSessions
      menteeSessions.splice(menteeSessions.indexOf(session._id), 1);
      var mentorSessions = session.mentor.upcomingSessions
      mentorSessions.splice(mentorSessions.indexOf(session._id), 1);
      session.remove(function(err) {
        if (err)
          console.log(err);
      });

      session.save(function(err) {
          if (err)
              next(err);
          session.mentee.save(function (err) {
            if (err)
                next(err);
            session.mentor.save(function (err) {
              if (err)
                  next(err);
              res.send("Session Deleted");
            })
          })
      });

    });
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
      res.render('profile_list', { user: req.user, profiles: user.mentees, title: "My Mentees" });
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
      res.render('profile_list', { user: req.user, profiles: user.mentors, title: "My Mentors" });
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
      res.render('profile_list', { user: req.user, profiles: profiles, title: "We Selected Some Mentors For You" });
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
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;

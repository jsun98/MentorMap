// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('user-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        //console.log(req.body);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'profile.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.profile.email     = email;
                newUser.profile.password  = newUser.generateHash(password);
                newUser.profile.first_name = req.body.first_name;
                newUser.profile.last_name  = req.body.last_name;

                if (req.body.role == 'mentor') {



                } else if (req.body.role == 'mentee') {


                }


                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('user-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        console.log(password);
        User.findOne({ 'profile.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

/*

    // =========================================================================
    // mentor_info =============================================================
    // =========================================================================

    passport.use('mentor_info', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'mentor.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                // set the user's local credentials
                user.mentor.gpa                   = req.body.gpa;
                user.mentor.gender                = req.body.gender;
                user.mentor.phone                 = req.body.phone;
                user.mentor.dob                   = req.body.dob; //this would be a date type
                user.mentor.linkedin              = req.body.linkedin;
                user.mentor.skills                = req.body.skills;//might need to push
                user.mentor.paragraphs            = req.body.paragraphs;//might need to push
                user.mentor.curr_school           = req.body.curr_school;
                user.mentor.curr_school_type      = req.body.curr_school_type;
                user.mentor.curr_major            = req.body.curr_major;
                user.mentor.curr_minor            = req.body.curr_minor;
                user.mentor.grad_year             = req.body.grad_year;
                user.mentor.high_school_programs  = req.body.high_school_programs;//might need to push
            }else {
              return done(null, false, req.flash('signupInfoMessage', 'Fail to update mentor info.'));
            }
        });

        });

    }));


    // =========================================================================
    // mentee_info =============================================================
    // =========================================================================

    passport.use('mentee_info', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'mentee.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                // set the user's local credentials
                user.mentee.gender               = req.body.gender;
                user.mentee.phone                = req.body.phone;
                user.mentee.avg_11               = req.body.avg_11;
                user.mentee.avg_12               = req.body.avg_12;
                user.mentee.high_school          = req.body.high_school;
                user.mentee.grade                = req.body.grade;
                user.mentee.skills               = req.body.skills;//might need to push
                user.mentee.linkedin             = req.body.linkedin;
                user.mentee.paragraphs           = req.body.paragraphs;//might need to push
                user.mentee.high_school_programs = req.body.high_school_programs;//might need to push
                user.mentee.preferred_program    = req.body.preferred_program;//might need to push
                user.mentee.preferred_school     = req.body.preferred_school;//might need to push
            }else {
              return done(null, false, req.flash('signupInfoMessage', 'Fail to update mentee info.'));

            }
        });

        });

    }));
*/

};

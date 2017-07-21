// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

var nodemailer = require('nodemailer');

var mailjet = require ('node-mailjet')
    .connect('ec64965cdf208fb3897abc986fe6b36b', 'ed1ab3ce9f19eaa293436bd774809eb2')




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
    // FIRST SIGNUP ============================================================
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
        console.log(req.body);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('errMessage', 'That Email is Already Taken!'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.email     = email;
                newUser.password  = newUser.generateHash(password);
                newUser.role      = req.body.role;
                newUser.verified  = false;
                newUser.creation_date = new Date();
                newUser.completed = false;
                newUser.profile.first_name = req.body.first_name;
                newUser.profile.last_name  = req.body.last_name;

                if (process.env.NODE_ENV == 'development' && process.env.AUTO_SIGNUP == 'true') {
                  newUser.verified = true;
                  newUser.completed = true;
                  newUser.profile.gender = "male";
                  newUser.profile.phone = "4166667777";
                  newUser.profile.age = "19";
                  newUser.profile.avg_11 = "4";
                  newUser.profile.avg_12 = "4";
                  newUser.profile.high_school = "Unionville High School";
                  newUser.profile.grade = "12";
                  newUser.profile.skills = ["President of DECA", "VP of CS Club"];
                  newUser.profile.linkedin = "www.google.ca";
                  newUser.profile.paragraphs = ["hi","hi","hi","hi"];
                  newUser.profile.high_school_program= ["AP","IB"];
                  newUser.profile.preferred_program = ["Medicine","Engineering"];
                  newUser.profile.preferred_school = ["Waterloo","University of Toronto"];
                  newUser.profile.gpa = "4.0";
                  newUser.profile.curr_school = "Univerisity of Waterloo";
                  newUser.profile.curr_major = "Software Engineering";
                  newUser.profile.curr_minor = "Applied Health Sciences";
                  newUser.profile.grad_year = 2021
                }

                // save the user
                newUser.save(function(err, savedUser) {
                    if (err)
                        next(err);

                    var hostname = process.env.NODE_ENV === 'development' ? 'localhost:3000' : req.hostname;
                    mailjet
                      .post("send")
                      .request({
                          "FromEmail":"admin@mentormap.ca",
                          "FromName":"MentorMap Admin",
                          "Subject":"MentorMap - Confirm Your Email Address!",
                          "Text-part":"",
                          "Html-part":'<a href="http://'+hostname+'/verify?id='+savedUser._id+'">Click On This Link To Verify Your Email</a>',
                          "Recipients":[
                                  {
                                    "Email": email
                                  }
                          ]
                      })
                      .then(function (response) {
                          console.log ("Email sent to client "+savedUser._id);
                      })
                      .catch(function (err) {
                          console.log (err.statusCode, err);
                      });

                    return done(null, newUser);
                });
            }

        });

        });

    }));



    // =========================================================================
    // LOGIN =============================================================
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

        User.findOne({ 'email' :  email })
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
          .exec(function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('errMessage', 'Email Not Found')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('errMessage', 'Wrong Password')); // create the loginMessage and save it to session as flashdata
                // if the user is found but the password is wrong

            //if email not verified
            if (!user.verified)
                return done(null, false, req.flash('errMessage', 'Please Verify Your Email First!'));

            //promise
            for (var i = 0; i < user.upcomingSessions.length; i++) {
              if (user.upcomingSessions[i].date < new Date()) {
                user.upcomingSessions[i].mentee.upcomingSessions.splice(i, 1);
                user.upcomingSessions[i].mentee.save();
                user.upcomingSessions[i].mentor.upcomingSessions.splice(i, 1);
                user.upcomingSessions[i].mentor.save();
                user.upcomingSessions[i].remove(function(err) {
                  if (err)
                    console.log(err);
                });
              }


            }
            return done(null, user);


        });

    }));

};

// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user'),
	mailjet = require('../../email_templates/email'),
	Zoom = require('zoomus')({
		key: 'R6fQ_CoxSUeWXxshTvhZhg',
		secret: 'AhhzZfhGL4T3ACCBjsjlK5IvqQqUvYERygMV',
	})

// expose this function to our app using module.exports
module.exports = function (passport) {

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	// used to deserialize the user
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})

	// =========================================================================
	// FIRST SIGNUP ============================================================
	// =========================================================================
	passport.use('user-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	}, (req, email, password, done) => {
		User.findOne({ email }, (err, user) => {
			if (err) return done(err)

			if (user) return done(null, false, { message: 'Email Already in Use!' })

			var newUser = new User()

			newUser.email = email
			newUser.password = newUser.generateHash(password)
			newUser.profile.first_name = req.body.first_name
			newUser.profile.last_name = req.body.last_name

			if (process.env.NODE_ENV === 'development') {
				newUser.tokens = 100
				newUser.verified = true
				newUser.completed = true
				newUser.profile.gender = 'male'
				newUser.profile.phone = '4166667777'
				newUser.profile.age = '19'
				newUser.profile.avg_11 = '4'
				newUser.profile.avg_12 = '4'
				newUser.profile.high_school = 'Unionville High School'
				newUser.profile.grade = '12'
				newUser.profile.skills = [ 'President of DECA', 'VP of CS Club' ]
				newUser.profile.linkedin = 'www.google.ca'
				newUser.profile.paragraphs = [ 'hi', 'hi', 'hi', 'hi' ]
				newUser.profile.high_school_program = [ 'AP', 'IB' ]
				newUser.profile.preferred_program = [ 'Medicine', 'Engineering' ]
				newUser.profile.preferred_school = [ 'Waterloo', 'University of Toronto' ]
				newUser.profile.gpa = '4.0'
				newUser.profile.curr_school = 'Univerisity of Waterloo'
				newUser.profile.curr_major = 'Software Engineering'
				newUser.profile.curr_minor = 'Applied Health Sciences'
				newUser.profile.grad_year = 2021

				Zoom.user.custCreate({
					email: newUser.email,
					type: 1,
					first_name: newUser.profile.first_name,
					last_name: newUser.profile.last_name,
				}, response => {
					if (response.error)
						done(response.error)
					else {
						newUser.ZoomId = response.id
						newUser.save((err, savedUser) => {
							if (err) done(err)

							var hostname = process.env.NODE_ENV === 'development' ? 'localhost:3000' : req.hostname
							mailjet
								.post('send')
								.request(require('../../email_templates/confirmation')(savedUser, hostname))
								.then(response => {
									console.log('Email sent to client ' + savedUser._id)
								})
								.catch(err => {
									console.log(err.statusCode, err)
								})

							done(null, newUser)
						})
					}

				})
			}


		})

	}))



	// =========================================================================
	// LOGIN =============================================================
	// =========================================================================

	passport.use('user-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	}, (req, email, password, done) => {
		User.findOne({ email })
			.exec((err, User) => {
				// if there are any errors, return the error before anything else
				if (err)
					return done(err)

				// if no user is found, return the message
				if (!User)
					return done(null, false, req.flash('errMessage', 'Email Not Found'))

				// if the user is found but the password is wrong
				if (!User.validPassword(password))
					return done(null, false, req.flash('errMessage', 'Wrong Password')) // create the loginMessage and save it to session as flashdata
				// if the user is found but the password is wrong

				// if email not verified
				if (!User.verified)
					return done(null, false, req.flash('errMessage', 'Please Verify Your Email First!'))

				// promise
				/*
				for (var i = 0; i < user.upcomingSessions.length; i++)
					if (user.upcomingSessions[i].date < new Date()) {
						user.upcomingSessions[i].mentee.upcomingSessions.splice(i, 1)
						user.upcomingSessions[i].mentee.save()
						user.upcomingSessions[i].mentor.upcomingSessions.splice(i, 1)
						user.upcomingSessions[i].mentor.save()
						user.upcomingSessions[i].remove(err => {
							if (err)
								console.log(err)
						})
					}
					*/
				return done(null, User)
			})
	}))

}

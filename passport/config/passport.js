// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user'),
	mailjet = require('../../email_templates/email'),
	gateway = require('../../BrainTree/braintree.js'),
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
	passport.use('mentee-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	}, (req, email, password, done) => {
		User.findOne({ email }, (err, user) => {
			if (err) return done(err)

			if (user) return done(null, false, req.flash('error', 'Email Already in Use!'))

			var newUser = new User()

			newUser.email = email
			newUser.password = newUser.generateHash(password)
			newUser.profile.first_name = req.body.first_name
			newUser.profile.last_name = req.body.last_name
			newUser.role = 'mentee'

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

				newUser.profile.curr_school = 'Univerisity of Waterloo'
				newUser.profile.curr_major = 'Software Engineering'
				newUser.profile.curr_minor = 'Applied Health Sciences'
				newUser.profile.grad_year = 2021
			}

			gateway.customer.create({
				firstName: newUser.profile.first_name,
				lastName: newUser.profile.last_name,
				email: newUser.email,
			}, (err, result) => {
				if (err) return done(err)
				if (!result.success) return done(new Error('Cannot create new BrainTree customer'))
				newUser.BrainTreeId = result.customer.id
				newUser.save()
					.then(savedUser => {
						done(null, newUser)
						var hostname = process.env.NODE_ENV === 'development' ? 'localhost:' + process.env.PORT : req.hostname
						return mailjet
							.post('send')
							.request(require('../../email_templates/confirmation')(savedUser, hostname))
					})
					.catch(err => {
						done(err)
					})

			})


		})

	}))

	passport.use('mentor-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	}, (req, email, password, done) => {
		if (req.params.secret !== process.env.MENTOR_CREATE_SECRET)
			return done(new Error('wrong secret'))
		User.findOne({ email }, (err, user) => {
			if (err) return done(err)

			if (user) return done(null, false, req.flash('error', 'Email Already in Use!'))

			var newUser = new User()

			newUser.email = email
			newUser.password = newUser.generateHash(password)
			newUser.profile.first_name = req.body.first_name
			newUser.profile.last_name = req.body.last_name
			newUser.role = 'mentor'

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

				newUser.profile.curr_school = 'Univerisity of Waterloo'
				newUser.profile.curr_major = 'Software Engineering'
				newUser.profile.curr_minor = 'Applied Health Sciences'
				newUser.profile.grad_year = 2021
			}

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

						var hostname = req.hostname
						mailjet
							.post('send')
							.request(require('../../email_templates/confirmation')(savedUser, hostname))
						done(null, newUser)
					})
				}
			})
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

				if (err)
					return done(err)


				if (!User)
					return done(null, false, req.flash('error', 'Email Not Found'))


				if (!User.validPassword(password))
					return done(null, false, req.flash('error', 'Wrong Password'))


				return done(null, User)
			})
	}))

}

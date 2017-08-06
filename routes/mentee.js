const express = require('express'),
	router = express.Router(),
	User = require('../passport/models/user')

router.use('*', isLoggedIn, isEmailVerified, isRegCompleted)

router.get('/dashboard', (req, res, next) => {
	User.findById(req.user._id)
		.populate('upcomingSessions')
		.populate({
			path: 'upcomingSessions',
			populate: {
				path: 'mentor',
				model: 'User',
			},
		})
		.populate({
			path: 'upcomingSessions',
			populate: {
				path: 'mentee',
				model: 'User',
			},
		})
		.sort({ 'upcomingSessions.date': -1 })
		.exec((err, user) => {
			if (err)
				next(err)
			user.upcomingSessions.sort((a, b) => new Date(a.date) - new Date(b.date))
			if (req.user.role === 'mentee')
				res.render('mentee_dashboard', {
					user,
					successMsg: req.flash('successMsg')[0] || '',
					infoMsg: req.flash('infoMsg')[0] || '',
				})
			else
				res.render('mentor_dashboard', {
					user,
					successMsg: req.flash('successMsg')[0] || '',
					infoMsg: req.flash('infoMsg')[0] || '',
				})

		})


})

function isEmailVerified (req, res, next) {
	if (req.user.verified)
		return next()

	res.redirect('/auth/email-confirm')
}

// checks if registration is completed
function isRegCompleted (req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.user.completed)
		return next()

	// if they aren't redirect them to the home page
	res.redirect('/register')
}

function isLoggedIn (req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next()


	// if they aren't redirect them to the home page
	res.redirect('/auth/login')
}

module.exports = router

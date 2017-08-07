const express = require('express'),
	router = express.Router(),
	User = require('../passport/models/user')

router.use('*', isLoggedIn, isEmailVerified)

router.get('/register', (req, res, next) => {
	// if (req.user.completed)
	// 	res.redirect('/mentee/dashboard')
	res.render('mentee/register', { user: req.user })
})

router.use('*', isRegCompleted)

router.get('/dashboard', (req, res, next) => {
	User.findById(req.user._id)
		.exec((err, user) => {
			if (err)
				next(err)
			res.render('mentee/dashboard', { user })

			// res.render('mentor_dashboard', {
			// 	user,
			// 	successMsg: req.flash('successMsg')[0] || '',
			// 	infoMsg: req.flash('infoMsg')[0] || '',
			// })
		})
})

router.get('/mymentors', (req, res, next) => {
	User.findById(req.user._id)
		.populate('mentors')
		.exec((err, user) => {
			if (err)
				next(err)
			res.render('common/profile_list', {
				user: req.user,
				profiles: user.mentors,
				title: 'My Mentors',
			})
		})
})

router.get('/mentor-list', (req, res, next) => {
	User.findRandom({
		role: 'mentor',
		completed: true,
		mentees: { $ne: req.user._id },
	}, (err, profiles) => {
		if (err)
			next(err)
		else
			res.render('common/profile_list', {
				user: req.user,
				profiles,
				title: 'Mentor Search',
			})

	}).limit(5)

})

router.get('/mentor-details/:id', (req, res, next) => {
	User.findById(req.params.id, (err, mentor) => {
		if (err) next(err)
		if (mentor.mentees.indexOf(req.user._id) !== -1)
			res.render('common/mentor_profile_details', {
				user: req.user,
				mentor,
				matched: true,
			})
		else
			res.render('common/mentor_profile_details', {
				user: req.user,
				mentor,
				matched: false,
			})

	})
})

router.get('/mentor-availability/:id', (req, res, next) => {
	User.findById(req.params.id, (err, mentor) => {
		if (err) next(err)
		res.render('mentee/mentor_availability', {
			user: req.user,
			mentor,
		})
	})
})

// Mentees choose mentor
router.post('/choose-mentor', (req, res, next) => {

	// might wanna change this to promise
	User.update({ _id: req.body.mentor_id }, { $addToSet: { mentees: req.user._id } }, err => {
		if (err)
			next(err)
		else
			User.update({ _id: req.user._id }, { $addToSet: { mentors: req.body.mentor_id } }, err => {
				if (err)
					next(err)
				else
					res.send('You Have Successfully Chosen Your Mentor!')
			})

	})

})

// Mentees cancels mentorship
router.post('/cancel-mentor', (req, res, next) => {

	// might wanna change this to promise
	User.update({ _id: req.body.mentor_id }, { $pull: { mentees: req.user._id } }, err => {
		if (err)
			next(err)
		else
			User.update({ _id: req.user._id }, { $pull: { mentors: req.body.mentor_id } }, err => {
				if (err)
					next(err)
				else
					res.send('You Have Successfully Cancelled This Mentorship!')
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
	if (req.user.completed)
		return next()
	res.redirect('/mentee/register')
}

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return next()
	res.redirect('/auth/login')
}

module.exports = router

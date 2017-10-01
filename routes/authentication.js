const express = require('express'),
	User = require('../passport/models/user'),
	mailjet = require('../email_templates/email'),
	router = express.Router(),
	passport = require('passport')

// =====================================
// LOGIN ===============================
// =====================================

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

router.get('/verify/:id', (req, res, next) => {
	User.findByIdAndUpdate(req.params.id, { verified: true })
		.then(newUser => {
			if (!newUser) return res.status(404).send()
			req.flash('success', 'Your account has now been verified. Log in to start exploring MentorMap!')
			if (req.isAuthenticated())
				req.logout()
			res.redirect('/auth/login')
		})
		.catch(err => {
			next(err)
		})
})

router.get('/email-confirm', isLoggedIn, (req, res, next) => {
	res.render('index/email-confirm')
})

router.get('/resend', isLoggedIn, (req, res, next) => {
	var hostname = req.hostname
	mailjet
		.post('send')
		.request(require('../email_templates/confirmation')(req.user, hostname))
	res.redirect('/auth/email-confirm')
})

// accessible iff not logged in
router.use('*', (req, res, next) => {
	if (req.isAuthenticated())
		return res.redirect('/dashboard')
	next()
})


router.get('/login', (req, res, next) => {
	res.render('index/login', {
		user: req.user,
		error: req.flash('error'),
		success: req.flash('success'),
		startPage: 'login',
	})
})

router.get('/signup', (req, res, next) => {
	res.render('index/login', {
		user: req.user,
		error: req.flash('error'),
		success: req.flash('success'),
		startPage: 'signup',
	})
})

router.get('/mentor-signup', (req, res, next) => {
	res.render('mentor/mentor_login', {
		user: req.user,
		error: req.flash('error'),
		success: req.flash('success'),
		startPage: 'signup',
	})
})

router.post('/login', passport.authenticate('user-login', {
	successRedirect: '/dashboard',
	failureRedirect: '/auth/login',
	failureFlash: true,
}))

router.post('/signup/', passport.authenticate('mentee-signup', {
	successRedirect: '/auth/email-confirm',
	failureRedirect: '/auth/signup',
	failureFlash: true,
}))

router.post('/mentor-signup', passport.authenticate('mentor-signup', {
	successRedirect: '/dashboard',
	failureRedirect: '/auth/mentor-signup',
	failureFlash: true,
}))

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) return next()
	res.redirect('/auth/login')
}

module.exports = router

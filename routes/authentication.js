const express = require('express'),
	router = express.Router(),
	passport = require('passport')

// =====================================
// LOGIN ===============================
// =====================================

router.get('/login', isLoggedIn, (req, res, next) => {
	res.render('index/login', {
		user: req.user,
		error: req.flash('error'),
		success: req.flash('success'),
		startPage: 'login',
	})
})

router.get('/signup', isLoggedIn, (req, res, next) => {
	res.render('index/login', {
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

router.post('/signup', passport.authenticate('mentee-signup', {
	successRedirect: '/email-confirm',
	failureRedirect: '/auth/signup',
	failureFlash: true,
}))

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return res.redirect('/dashboard')
	next()
}

module.exports = router

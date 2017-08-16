const express = require('express'),
	router = express.Router(),
	passport = require('passport')

// =====================================
// LOGIN ===============================
// =====================================

router.get('/login', (req, res, next) => {
	res.render('index/login', {
		user: req.user,
		messages: req.flash('error'),
		startPage: 'login',
	})
})

router.get('/signup', (req, res, next) => {
	res.render('index/login', {
		user: req.user,
		messages: req.flash('error'),
		startPage: 'signup',
	})
})

router.post('/login', passport.authenticate('user-login', {
	successRedirect: '/dashboard',
	failureRedirect: '/auth/login',
	failureFlash: true,
}))

router.post('/signup', passport.authenticate('user-signup', {
	successRedirect: '/email-confirm',
	failureRedirect: '/auth/signup',
	failureFlash: true,
}))

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router

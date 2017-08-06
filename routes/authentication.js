const express = require('express'),
	router = express.Router(),
	passport = require('passport')

// =====================================
// LOGIN ===============================
// =====================================

router.get('/login', (req, res, next) => {
	res.render('login', { user: req.user })
})

router.post('/login', passport.authenticate('user-login', {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
	failureFlash: true,
}))

router.post('/signup', passport.authenticate('user-signup', {
	successRedirect: '/signup-success',
	failureRedirect: '/login',
	failureFlash: true,
}))

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router

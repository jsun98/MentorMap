const express = require('express'),
	router = express.Router(),
	passport = require('passport')

// =====================================
// LOGIN ===============================
// =====================================

router.get('/login', (req, res, next) => {
	console.log(req.flash('error'))
	res.render('index/login', {
		user: req.user,
		message: req.flash('error') || req.flash('success'),
	})
})

router.post('/login', (req, res, next) => {
	passport.authenticate('user-login', (err, user, info) => {
		if (err) return next(err)
		if (!user) {
			req.flash('error', info)
			return res.redirect('/auth/login')
		}
		req.logIn(user, err => {
			if (err) return next(err)
			if (user.role === 'mentor')
				return res.redirect('/mentor/dashboard')
			return res.redirect('/mentee/dashboard')

		})
	})(req, res, next)
})

router.get('/email-confirm', (req, res, next) => {
	res.render('index/email-confirm')
})

router.post('/signup', passport.authenticate('user-signup', {
	successRedirect: '/auth/email-confirm',
	failureRedirect: '/auth/login',
	failureFlash: true,
	successFlash: true,
}))

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router

const express = require('express'),
	mailjet = require('../email_templates/email'),
	router = express.Router(),
	User = require('../passport/models/user')

router.get('/', (req, res, next) => {
	res.render('index/index', {
		authenticated: req.isAuthenticated(),
		user: req.user,
	})

})

router.get('/email-confirm', isLoggedIn, (req, res, next) => {
	res.render('index/email-confirm')
})

router.get('/verify/:id', (req, res, next) => {
	User.findByIdAndUpdate(req.params.id, { verified: true })
		.then(newUser => {
			req.flash('success', 'Your account has now been verified. Log in to start exploring MentorMap!')
			res.redirect('/auth/login')
		})
		.catch(err => {
			next(err)
		})
})

router.get('/resend', isLoggedIn, (req, res, next) => {
	var hostname = process.env.NODE_ENV === 'development' ? 'localhost:' + process.env.PORT : req.hostname
	mailjet
		.post('send')
		.request(require('../email_templates/confirmation')(req.user, hostname))
	res.redirect('/email-confirm')
})

router.get('/dashboard', isLoggedIn, (req, res, next) => {
	if (req.user.role === 'mentor')
		res.redirect('/mentor/dashboard')
	else
		res.redirect('/mentee/dashboard')
})

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return next()
	res.redirect('/auth/login')
}

module.exports = router

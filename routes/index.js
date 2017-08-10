const express = require('express'),
	router = express.Router(),
	User = require('../passport/models/user')

router.get('/', (req, res, next) => {
	let authenticated = false
	if (req.isAuthenticated())
		authenticated = true
	res.render('index/index', {
		authenticated,
		user: req.user,
	})

})

router.get('/verify', (req, res, next) => {
	User.findByIdAndUpdate(req.query.id, { verified: true })
		.then(() => {
			req.flash('success', "Thank You For Verifying Your Email! We Are Thrilled to Have You On Board! Click on 'Log In' to Access Your Account.")
			res.redirect('/')
		})
		.catch(err => {
			next(err)
		})
})

module.exports = router

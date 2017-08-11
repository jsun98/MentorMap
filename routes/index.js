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

router.get('/verify/:id', (req, res, next) => {
	console.log(req.params.id)
	User.findByIdAndUpdate(req.params.id, { verified: true })
		.then(user => {
			console.log(user)
			// req.flash('success', "Thank You For Verifying Your Email! We Are Thrilled to Have You On Board! Click on 'Log In' to Access Your Account.")
			res.redirect('/')
		})
		.catch(err => {
			next(err)
		})
})

module.exports = router

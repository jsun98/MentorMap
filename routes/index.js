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
	User.findByIdAndUpdate(req.params.id, { verified: true })
		.then(newUser => {
			res.redirect('/')
		})
		.catch(err => {
			next(err)
		})
})

module.exports = router

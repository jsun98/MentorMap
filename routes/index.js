const express = require('express'),
	router = express.Router()

router.get('/', (req, res, next) => {
	res.render('index')

})

module.exports = router

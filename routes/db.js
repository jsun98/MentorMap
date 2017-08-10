const express = require('express'),
	router = express.Router(),
	//	User = require('../passport/models/user'),
	Session = require('../passport/models/session')


router.get('/sessions/:id', (req, res) => {
	const userId = req.params.id
	Session.find({
		$and: [
			{ $or: [ { mentor: userId }, { mentee: userId } ] },
			{ start: { $gte: new Date(req.query.start) } },
			{ end: { $lte: new Date(req.query.end) } },
		],
	})
		.populate('mentor')
		.populate('mentee')
		.then(sessions => {
			res.status(200).json(sessions)
		})
		.catch(err => {
			console.log(err)
			res.status(500).send(err)
		})
})
module.exports = router

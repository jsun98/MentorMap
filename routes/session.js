const express = require('express'),
	router = express.Router(),
	//	User = require('../passport/models/user'),
	Session = require('../passport/models/session'),
	Zoom = require('zoomus')({
		key: 'oxmx-UJlQ3-3vGBz1s98fQ',
		secret: '1hWel7g0W8nv2tTu0I9jPWT8fOJJsYz',
	})


router.get('/byUserId/:id', (req, res) => {
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

router.post('/', (req, res, next) => {
	var session = new Session(req.body)
	session.save()
		.then(saved => {
			res.status(200).send(saved)
		})
		.catch(err => {
			next(err)
		})
})

router.put('/:id', (req, res, next) => {
	if (req.body.mentee === '') req.body.mentee = undefined
	Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updated => {
			res.status(200).send(updated)
		})
		.catch(err => {
			next(err)
		})
})

router.delete('/:id', (req, res, next) => {
	Session.findByIdAndRemove(req.params.id)
		.then(updated => {
			res.status(200).send()
		})
		.catch(err => {
			next(err)
		})
})

module.exports = router

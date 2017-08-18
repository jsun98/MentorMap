const express = require('express'),
	router = express.Router(),
	moment = require('moment'),
	User = require('../passport/models/user'),
	Session = require('../passport/models/session'),
	mailjet = require('../email_templates/email'),
	Mentorship = require('../passport/models/mentorship'),
	gateway = require('../BrainTree/braintree.js'),
	Zoom = require('../zoom/zoom')

router.use('*', isLoggedIn, isEmailVerified, isMentor)

router.get('/register', (req, res, next) => {
	if (req.user.completed)
		return res.redirect('/mentor/dashboard')
	res.render('mentor/register', { user: req.user })
})

router.use('*', isRegCompleted)

router.get('/dashboard', (req, res, next) => {
	res.render('mentor/dashboard', { user: req.user })
})

router.post('/availability', (req, res, next) => {
	var newSession = new Session()
	newSession.start = req.body.start
	newSession.end = req.body.end
	newSession.mentor = req.user._id
	newSession.type = req.body.type
	newSession.save()
		.then(savedSession => {
			res.status(200).json({ _id: savedSession._id })
		})
		.catch(err => {
			next(err)
		})
})

router.get('/mySessions', (req, res) => {
	Session.find({
		mentor: req.user._id,
		start: { $gte: new Date(req.query.start) },
		end: { $lte: new Date(req.query.end) },
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

router.post('/session/new', (req, res, next) => {
	req.body.mentor = req.user._id
	var session = new Session(req.body)
	session.save()
		.then(saved => {
			res.status(200).send(saved)
		})
		.catch(err => {
			next(err)
		})
})

router.put('/session/update/:id', (req, res, next) => {
	Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updated => {
			res.status(200).send(updated)
		})
		.catch(err => {
			next(err)
		})
})

// TRANSACTION
router.put('/session/confirm/:id', (req, res, next) => {
	var updated = req.body
	Session.findById(req.params.id)
		.then(session => {
			if (!session || !session.paymentMethodToken) return res.status(404).send()
			gateway.transaction.sale({
				paymentMethodToken: session.paymentMethodToken,
				amount: '11.99',
				options: { submitForSettlement: true },
			}, (err, result) => {
				if (err) next(err)
				if (!result.success) res.status(400).send()
				Zoom.meeting.create({
					host_id: req.user.ZoomId,
					type: 2,
					topic: 'Mentoring Session',
					start_time: moment.utc(updated.start).format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
					timezone: 'UTC',
					duration: (moment(updated.end) - moment(updated.start)) / 60000,
				}, response => {
					if (response.error)
						next(response.error)
					else
						Session.findByIdAndUpdate(req.params.id, {
							type: 'processing',
							color: 'red',
							joinURL: response.join_url,
							startURL: response.start_url,
						}, { new: true })
							.populate('mentee')
							.then(session => {
								var hostname = process.env.NODE_ENV === 'development' ? 'localhost:' + process.env.PORT : req.hostname
								mailjet
									.post('send')
									.request(require('../email_templates/session_response')(req.user, session.mentee, session, 'Accepted', hostname))
								mailjet
									.post('send')
									.request(require('../email_templates/session_confirm')(req.user, session.mentee, session, hostname))
							})
							.then(() => {
								res.status(200).send()
							})
							.catch(err => {
								next(err)
							})
				})
			})
		})



})

// TRANSACTION
router.put('/session/refuse/:id', (req, res, next) => {
	Session.findByIdAndUpdate(req.params.id, {
		type: 'available',
		color: 'green',
		mentee: undefined,
		paymentMethodToken: '',
	})
		.populate('mentee')
		.then(updated => {
			var hostname = process.env.NODE_ENV === 'development' ? 'localhost:' + process.env.PORT : req.hostname
			mailjet
				.post('send')
				.request(require('../email_templates/session_response')(req.user, updated.mentee, updated, 'Refused', hostname))
				.then(() => {
					res.status(200).send()
				})
				.catch(err => {
					next(err)
				})
		})
		.catch(err => {
			next(err)
		})
})

router.delete('/session/delete/:id', (req, res, next) => {
	Session.findByIdAndRemove(req.params.id)
		.then(updated => {
			res.status(200).send()
		})
		.catch(err => {
			next(err)
		})
})

router.get('/my-mentees', (req, res, next) => {
	Mentorship.find({
		mentor: req.user._id,
		mentee: { $exists: true },
	})
		.populate('mentee')
		.exec()
		.then(mentorships => {
			const menteesArr = []
			for (var i = 0; i < mentorships.length; i++)
				menteesArr.push(mentorships[i].mentee)
			res.render('common/profile_list', {
				user: req.user,
				profiles: menteesArr,
				title: 'My Mentees',
			})
		})
		.catch(err => {
			next(err)
		})
})

router.get('/mentor-list', (req, res, next) => {
	User.find({
		role: 'mentor',
		completed: true,
		verified: true,
		_id: { $ne: req.user._id },
	}).exec()
		.then(profiles => {
			res.render('common/profile_list', {
				user: req.user,
				profiles,
				title: 'Mentor Search',
			})
		})
		.catch(err => {
			next(err)
		})

})

router.get('/mentor-profile/:id', (req, res, next) => {
	User.findOne({
		_id: req.params.id,
		completed: true,
		verified: true,
		role: 'mentor',
	}).exec()
		.then(mentor => {
			if (!mentor) return res.status(200).send('Mentor Not Found')
			res.render('common/mentor_profile_details', {
				user: req.user,
				mentor,
				matched: false,
			})
		})
		.catch(err => {
			next(err)
		})
})

router.get('/mentee-profile/:id', (req, res, next) => {
	User.findOne({
		_id: req.params.id,
		completed: true,
		verified: true,
		role: 'mentee',
	}).exec()
		.then(mentee => {
			if (!mentee) return res.status(200).send('Mentee Not Found')
			res.render('common/mentee_profile_details', {
				user: req.user,
				mentee,
			})
		})
		.catch(err => {
			next(err)
		})
})



function isMentor (req, res, next) {
	if (req.user.role === 'mentor')
		return next()
	res.redirect('/mentee/dashboard')
}

function isEmailVerified (req, res, next) {
	if (req.user.verified)
		return next()
	res.redirect('/email-confirm')
}

// checks if registration is completed
function isRegCompleted (req, res, next) {
	if (req.user.completed)
		return next()
	res.redirect('/mentor/register')
}

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return next()
	res.redirect('/auth/login')
}

module.exports = router

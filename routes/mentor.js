const express = require('express'),
	router = express.Router(),
	User = require('../passport/models/user'),
	Session = require('../passport/models/session'),
	mailjet = require('../email_templates/email'),
	Mentorship = require('../passport/models/mentorship'),
	Zoom = require('../zoom/zoom'),
	moment = require('moment')

router.use('*', isLoggedIn, isEmailVerified, isMentor)

router.get('/register', (req, res, next) => {
	if (req.user.completed) return res.redirect('/mentor/dashboard')
	res.render('mentor/register', { user: req.user })
})

router.post('/register', (req, res, next) => {

	if (req.user.completed) return res.redirect('/dashboard')

	req.body.skills = req.body.skills.split(',')
	if (req.body.high_school_program.constructor !== Array)
		req.body.high_school_program = [ req.body.high_school_program ]

	User.findByIdAndUpdate(req.user._id, {
		$set:
			{
				completed: true,
				'profile.gender': req.body.gender,
				'profile.phone': req.body.phone,
				'profile.high_school_program': req.body.high_school_program,
				'profile.skills': req.body.skills,
				'profile.linkedin': req.body.linkedin,
				'profile.paragraphs': req.body.paragraphs,
				'profile.gpa': parseInt(req.body.gpa),
				'profile.age': req.body.age,
				'profile.curr_school': req.body.curr_school,
				'profile.curr_major': req.body.curr_major,
				'profile.curr_minor': req.body.curr_minor,
				'profile.grad_year': parseInt(req.body.grad_year),
			},
	})
		.then(() => {
			res.redirect('/dashboard')
		})
		.catch(err => {
			next(err)
		})


})

router.use('*', isRegCompleted, isTutorialComplete)

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

router.get('/my-sessions', (req, res, next) => {
	Session.find({
		mentor: req.user._id,
		start: { $gte: new Date(req.query.start) },
		end: { $lte: new Date(req.query.end) },
	}, '-creation_date -paymentMethodToken -transaction_id -joinURL')
		.populate('mentor', 'profile.first_name profile.last_name')
		.populate('mentee', 'profile.first_name profile.last_name')
		.then(sessions => {
			res.status(200).json(sessions)
		})
		.catch(err => {
			next(err)
		})
})

router.post('/session/new', (req, res, next) => {
	var session = new Session({
		start: req.body.start,
		end: req.body.end,
		mentor: req.user._id,
		type: 'available',
		color: 'green',
	})
	session.save()
		.then(saved => {
			res.status(200).send()
		})
		.catch(err => {
			next(err)
		})
})

router.put('/session/update-time/:id', (req, res, next) => {
	Session.findOneAndUpdate({
		_id: req.params.id,
		mentor: req.user._id,
		type: 'available',
	}, {
		start: req.body.start,
		end: req.body.end,
	})
		.then(() => {
			res.status(200).send()
		})
		.catch(err => {
			next(err)
		})
})

// TRANSACTION
router.put('/session/confirm/:id', (req, res, next) => {


	Session.findOne({
		_id: req.params.id,
		mentor: req.user._id,
		type: 'requested',
	})
		.populate('mentor')
		.populate('mentee')
		.then(session => {
			if (!session) return res.status(404).send()
			Zoom.meeting.create({
				host_id: session.mentor.ZoomId,
				type: 2,
				topic: 'Mentoring Session',
				start_time: moment.utc(session.start).format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
				timezone: 'UTC',
				duration: (moment(session.end) - moment(session.start)) / 60000,
			}, response => {
				if (response.error) return next(new Error(response.error))
				session.type = 'scheduled'
				session.color = 'red'
				session.joinURL = response.join_url
				session.startURL = response.start_url
				session.save()
					.then(() => {
						const hostname = 'mentormap.ca'
						mailjet
							.post('send')
							.request(require('../email_templates/session_response')(session.mentor, session.mentee, session, 'Accepted', hostname))
						mailjet
							.post('send')
							.request(require('../email_templates/session_confirm')(session.mentor, session.mentee, session, hostname))
						res.status(200).send()
					})
					.catch(err => next(err))
			})
		})
		.catch(err => {
			next(err)
		})

})

// TRANSACTION
router.put('/session/refuse/:id', (req, res, next) => {
	Session.findOneAndUpdate({
		_id: req.params.id,
		mentor: req.user._id,
		type: 'requested',
	}, {
		type: 'available',
		color: 'green',
		mentee: undefined,
		paymentMethodToken: '',
		transaction_id: '',
	})
		.populate('mentee')
		.then(updated => {
			var hostname = req.hostname
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
	Session.findOneAndRemove({
		_id: req.params.id,
		mentor: req.user._id,
		type: 'available',
	})
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

router.get('/review', (req, res, next) => {
	res.render('common/review', { user: req.user })
})

router.get('/help', (req, res, next) => {
	res.render('mentor/help', { user: req.user })
})

router.get('/inquery', (req, res, next) => {
	res.render('common/inquery', { user: req.user })
})

function isTutorialComplete (req, res, next) {
	if (req.user.tutorial)
		return next()
	User.findByIdAndUpdate(req.user._id, { tutorial: true })
		.then(() => {
			res.redirect('/mentor/help')
		})
		.catch(() => {
			res.redirect('/mentor/dashboard')
		})
}

function isMentor (req, res, next) {
	if (req.user.role === 'mentor')
		return next()
	res.redirect('/mentee/dashboard')
}

function isEmailVerified (req, res, next) {
	if (req.user.verified)
		return next()
	res.redirect('/auth/email-confirm')
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

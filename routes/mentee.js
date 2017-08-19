const
	express = require('express'),
	router = express.Router(),
	User = require('../passport/models/user'),
	Session = require('../passport/models/session'),
	mailjet = require('../email_templates/email'),
	Mentorship = require('../passport/models/mentorship'),
	gateway = require('../BrainTree/braintree.js')

router.use('*', isLoggedIn, isEmailVerified, isMentee)

router.get('/register', (req, res, next) => {
	if (req.user.completed)
		return res.redirect('/mentee/dashboard')
	res.render('mentee/register', { user: req.user })
})

router.post('/register', (req, res, next) => {

	if (req.user.completed)
		res.redirect('/dashboard')


	req.body.skills = req.body.skills.split(',')

	if (req.body.high_school_program.constructor !== Array)
		req.body.high_school_program = [ req.body.high_school_program ]
	if (req.body.preferred_program.constructor !== Array)
		req.body.preferred_program = [ req.body.preferred_program ]

	User.findByIdAndUpdate(req.user.id, {
		$set:
						{
							completed: true,
							'profile.gender': req.body.gender,
							'profile.phone': req.body.phone,
							'profile.age': req.body.age,
							'profile.avg_11': parseInt(req.body.avg_11),
							'profile.avg_12': parseInt(req.body.avg_12),
							'profile.high_school': req.body.high_school,
							'profile.grade': parseInt(req.body.grade),
							'profile.skills': req.body.skills,
							'profile.linkedin': req.body.linkedin,
							'profile.paragraphs': req.body.paragraphs,
							'profile.high_school_program': req.body.high_school_program,
							'profile.preferred_program': req.body.preferred_program,
							'profile.preferred_school': req.body.preferred_school,
						},
	})
		.then(() => {
			res.redirect('/dashboard')
		})
		.catch(err => {
			next(err)
		})


})

router.use('*', isRegCompleted)

router.get('/dashboard', (req, res, next) => {
	res.render('mentee/dashboard', { user: req.user })
})

router.get('/paymentToken', (req, res, next) => {
	gateway.clientToken.generate({ customerId: req.user.BrainTreeId }, (err, response) => {
		if (err) next(err)
		res.status(200).send(response.clientToken)
	})
})

router.get('/my-mentors', (req, res, next) => {
	Mentorship.find({ mentee: req.user._id })
		.populate('mentor')
		.exec()
		.then(mentorships => {
			const mentorsArr = []
			for (var i = 0; i < mentorships.length; i++)
				mentorsArr.push(mentorships[i].mentor)
			res.render('common/profile_list', {
				user: req.user,
				profiles: mentorsArr,
				title: 'My Mentors',
			})
		})
		.catch(err => {
			next(err)
		})
})

router.get('/new-mentors', (req, res, next) => {
	Mentorship.find({ mentee: req.user._id }).exec()
		.then(mentorships => {
			const mentorsArr = [ ]
			for (var i = 0; i < mentorships.length; i++)
				mentorsArr.push(mentorships[i].mentor)
			return User.findRandom({
				role: 'mentor',
				completed: true,
				verified: true,
				$or: [ { mentorsArr: { $size: 0 } }, { _id: { $nin: mentorsArr } } ],
			}).limit(4)
		})
		.then(mentors => {
			res.render('common/profile_list', {
				user: req.user,
				profiles: mentors,
				title: 'Mentor Search',
			})
		})
		.catch(err => {
			next(err)
		})
})

router.get('/mentor-profile/:id', (req, res, next) => {
	let temp
	User.findOne({
		_id: req.params.id,
		completed: true,
		verified: true,
		role: 'mentor',
	}).exec()
		.then(mentor => {
			if (!mentor) return res.status(200).send('Mentor Not Found')
			temp = mentor
			return Mentorship.findOne({
				mentee: req.user._id,
				mentor: mentor._id,
			}).exec()
		})
		.then(mentorship => {
			var matched = !!mentorship
			res.render('common/mentor_profile_details', {
				user: req.user,
				mentor: temp,
				matched,
			})
		})
		.catch(err => {
			next(err)
		})
})

router.get('/mentor-availability/:id', (req, res, next) => {
	let temp
	User.findOne({
		_id: req.params.id,
		role: 'mentor',
	}).exec()
		.then(mentor => {
			if (!mentor) return res.status(200).send('Mentor Not Found')
			temp = mentor
			return Mentorship.findOne({
				mentor: mentor._id,
				mentee: req.user._id,
			}).exec()
		})
		.then(mentorship => {
			if (!mentorship) return res.status(200).send('You Are Not In A Mentorship with this mentor!')
			res.render('mentee/mentor_availability', {
				user: req.user,
				mentor: temp,
			})
		})
		.catch(err => {
			next(err)
		})
})

router.get('/sessionByMentorId/:id', (req, res) => {
	Session.find({
		mentor: req.params.id,
		$or: [ { type: 'available' }, { mentee: req.user._id } ],
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

router.get('/mySessions', (req, res) => {
	Session.find({
		mentee: req.user._id,
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

// Mentees choose mentor
router.post('/choose-mentor', (req, res, next) => {
	Mentorship.findOne({
		mentee: req.user._id,
		mentor: req.body.mentor_id,
	}).exec()
		.then(mentorship => {
			if (mentorship) return res.status(200).send('already in mentorship')
			const newMentorship = new Mentorship()
			newMentorship.mentor = req.body.mentor_id
			newMentorship.mentee = req.user._id
			return newMentorship.save()
		})
		.then(() => {
			res.status(200).send()
		})
		.catch(err => {
			next(err)
		})
})

router.put('/session/cancel/:id', (req, res, next) => {
	req.body.mentee = undefined
	Session.findByIdAndUpdate(req.params.id, {
		color: 'green',
		mentee: undefined,
		paymentMethodToken: '',
		type: 'available',
	}, { new: true })
		.then(updated => {
			res.status(200).send(updated)
		})
		.catch(err => {
			next(err)
		})
})

// TRANSACTION
router.put('/session/choose/:id', (req, res, next) => {
	gateway.paymentMethod.create({
		customerId: req.user.BrainTreeId,
		paymentMethodNonce: req.body.nonce,
		options: {
			verifyCard: true,
			makeDefault: true,
		},
	}, (err, result) => {
		if (err) return next(err)
		if (!result.success) res.status(400).send(result.verification.status)
		console.log(result.paymentMethod.token)
		Session.findByIdAndUpdate(req.params.id, {
			mentee: req.user._id,
			paymentMethodToken: result.paymentMethod.token,
			color: 'orange',
			type: 'requested',
		}, { new: true })
			.populate('mentor')
			.then(updated => {
				var hostname = process.env.NODE_ENV === 'development' ? 'localhost:' + process.env.PORT : req.hostname
				return mailjet
					.post('send')
					.request(require('../email_templates/new_session')(updated.mentor, req.user, updated, hostname))
			})
			.then(() => {
				res.status(200).send()
			})
			.catch(err => {
				next(err)
			})
	})
	// gateway.transaction.sale({
	// 	amount: '11.99',
	// 	paymentMethodNonce: req.body.nonce, // 'fake-valid-nonce'
	// 	options: { submitForSettlement: false },
	// }, (err, result) => {
	// 	if (err) next(err)
	// 	console.log(result)
	// 	console.log('tranaction details: ')
	// 	console.log(result.success)
	// 	console.log(result.transaction.type)
	// 	console.log(result.transaction.status)
	// 	if (result.success)
	// 		Session.findByIdAndUpdate(req.params.id, {
	// 			color: 'orange',
	// 			type: 'requested',
	// 			mentee: req.user._id,
	// 			transaction_id: result.transaction.id,
	// 		}, { new: true })
	// 			.populate('mentor')
	// 			.then(updated => {
	// 				var hostname = process.env.NODE_ENV === 'development' ? 'localhost:' + process.env.PORT : req.hostname
	// 				return mailjet
	// 					.post('send')
	// 					.request(require('../email_templates/new_session')(updated.mentor, req.user, updated, hostname))
	// 			})
	// 			.then(() => {
	// 				res.status(200).send()
	// 			})
	// 			.catch(err => {
	// 				next(err)
	// 			})
	// 	else
	// 		res.status(400).send()
	// })

})

function isMentee (req, res, next) {
	if (req.user.role === 'mentee')
		return next()
	res.redirect('/mentor/dashboard')
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
	res.redirect('/mentee/register')
}

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return next()
	res.redirect('/auth/login')
}

module.exports = router

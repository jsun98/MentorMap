const express = require('express'),
	router = express.Router(),
	User = require('../passport/models/user'),
	Session = require('../passport/models/session'),
	Mentorship = require('../passport/models/mentorship')


router.use('*', isLoggedIn, isEmailVerified, isMentee)

router.get('/register', (req, res, next) => {
	if (req.user.completed)
		return res.redirect('/mentee/dashboard')
	res.render('mentee/register', { user: req.user })
})

router.use('*', isRegCompleted)

router.get('/dashboard', (req, res, next) => {
	res.render('mentee/dashboard', { user: req.user })
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
	Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updated => {
			res.status(200).send(updated)
		})
		.catch(err => {
			next(err)
		})
})

router.put('/session/choose/:id', hasSufficientTokens, (req, res, next) => {
	req.body.mentee = req.user._id
	Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updated => {
			res.status(200).send(updated)
		})
		.catch(err => {
			next(err)
		})
})

router.get('/tokens', (req, res, next) => {
	Session.find({
		mentee: req.user._id,
		type: { $in: [ 'pending', 'taken' ] },
	}).count()
		.then(count => {
			console.log(count)
			const amt = req.user.tokens - count
			res.render('common/tokens', {
				user: req.user,
				tokens: amt,
			})
		})
		.catch(err => {
			next(err)
		})
})

function hasSufficientTokens (req, res, next) {
	Session.find({
		mentee: req.user._id,
		type: { $in: [ 'pending', 'taken' ] },
	}).count()
		.then(count => {
			console.log(count)
			const amt = req.user.tokens - count
			if (amt > 0)
				return next()
			return res.status(200).send('Insufficient tokens')
		})
		.catch(err => {
			next(err)
		})
}

function isMentee (req, res, next) {
	if (req.user.role === 'mentee')
		return next()
	res.redirect('/mentor/dashboard')
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
	res.redirect('/mentee/register')
}

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return next()
	res.redirect('/auth/login')
}

module.exports = router

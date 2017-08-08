const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = require('../passport/models/user'),
	Session = require('../passport/models/session')

router.use('*', isLoggedIn, isEmailVerified)

router.get('/register', (req, res, next) => {
	res.render('mentor/register', { user: req.user })
})

router.use('*', isRegCompleted)


router.get('/dashboard', (req, res, next) => {
	User.findById(req.user._id)
		.populate('upcomingSessions')
		.populate({
			path: 'upcomingSessions',
			populate: {
				path: 'mentor',
				model: 'User',
			},
		})
		.populate({
			path: 'upcomingSessions',
			populate: {
				path: 'mentee',
				model: 'User',
			},
		})
		.exec((err, user) => {
			if (err)
				next(err)
			res.render('mentor/dashboard', { user })

			// res.render('mentor_dashboard', {
			// 	user,
			// 	successMsg: req.flash('successMsg')[0] || '',
			// 	infoMsg: req.flash('infoMsg')[0] || '',
			// })
		})
})

router.post('/availability', (req, res, next) => {

	console.log(req.body)
	var newSession = new Session()

	newSession.start = req.body.start
	newSession.end = req.body.end
	newSession.mentor = req.user._id
	newSession.type = req.body.type
	newSession.save()
		.then(savedSession => {
			User.findByIdAndUpdate(req.user._id, { $addToSet: { upcomingSessions: savedSession._id } })
				.then(() => {
					res.status(200).json({ _id: savedSession._id })
				})
				.then(null, err => {
					res.status(500).send(err)
				})
		})
		.then(null, err => {
			res.status(500).send(err)
		})




	// var newSession = new Session()
	// newSession.creation_date = new Date()
	// newSession.type = req.body.type
	// newSession.purpose = req.body.purpose
	// newSession.date = new Date(req.body.date)
	// newSession.startTime = req.body.startTime
	// newSession.endTime = req.body.endTime
	// newSession.mentor = req.user._id
	// newSession.mentee = req.body.mentee_id

	// save the session
	// newSession.save((err, savedSession) => {
	// 	if (err)
	// 		next(err)
	// 	User.update({ _id: req.body.mentee_id }, { $addToSet: { upcomingSessions: savedSession._id } }, err => {
	// 		if (err)
	// 			next(err)
	// 		else
	// 			User.update({ _id: req.user._id }, { $addToSet: { upcomingSessions: savedSession._id } }, err => {
	// 				if (err)
	// 					next(err)
	// 				else {
	// 					var meeting = {
	// 						host_id: 3638201174,
	// 						type: 2,
	// 						topic: 'Mentoring Session',
	// 						start_time: newSession.date.setHours(req.body.startTime.split(':')[0], req.body.startTime.split(':')[1]),
	// 						timezone: 'America/New_York',
	// 					}
	//
	// 					Zoom.meeting.create(meeting, res => {
	// 						if (res.error)
	// 							next(res.error)
	// 						else {
	// 							console.log('new meeting scheduled')
	// 							console.log(res)
	// 							req.flash('successMsg', 'Session Created Successfully')
	// 							res.redirect('/dashboard')
	// 						}
	// 					})
	// 				}
	// 			})
	//
	// 	})
	// })



	// User.findById(req.user._id)
	// 	.exec((err, user) => {
	// 		if (err)
	// 			next(err)
	// 		res.render('mentor/dashboard', { user })
	//
	// 		// res.render('mentor_dashboard', {
	// 		// 	user,
	// 		// 	successMsg: req.flash('successMsg')[0] || '',
	// 		// 	infoMsg: req.flash('infoMsg')[0] || '',
	// 		// })
	// 	})
})

router.put('/availability', (req, res, next) => {
	console.log(req.body)
	Session.findByIdAndUpdate(req.body._id, req.body)
		.then(doc => {
			res.status(200).send('update success')
		})
		.then(null, err => {
			res.status(500).send(err)
		})
})

router.delete('/availability', (req, res, next) => {
	console.log(req.body)
	Session.findByIdAndRemove(req.body._id)
		.then(doc => User.update({ $or: [ { _id: doc.mentor }, { _id: doc.mentee } ] }, { $pull: { upcomingSessions: req.body._id } }, { multi: true }).exec())
		.then(() => {
			res.status(200).send('deletion success')
		})
		.then(null, err => {
			console.log(err)
			res.status(500).send(err)
		})
})

router.get('/mymentees', (req, res, next) => {
	User.findById(req.user._id)
		.populate('mentees')
		.exec((err, user) => {
			if (err)
				next(err)
			res.render('common/profile_list', {
				user: req.user,
				profiles: user.mentees,
				title: 'My Mentees',
			})
		})
})

router.get('/mentor-list', (req, res, next) => {
	User.find({
		role: 'mentor',
		completed: true,
		_id: { $ne: req.user._id },
	}, (err, profiles) => {
		if (err)
			next(err)
		else
			res.render('common/profile_list', {
				user: req.user,
				profiles,
				title: 'Mentor Search',
			})
	})

})

router.get('/mentor-details/:id', (req, res, next) => {
	User.findById(req.params.id, (err, mentor) => {
		if (err) next(err)
		res.render('common/mentor_profile_details', {
			user: req.user,
			mentor,
		})

	})
})

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

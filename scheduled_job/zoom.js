var CronJob = require('cron').CronJob,
	moment = require('moment'),
	Session = require('../passport/models/session'),
	mailjet = require('../email_templates/email'),
	gateway = require('../BrainTree/braintree.js'),
	Zoom = require('../zoom/zoom'),
	job = new CronJob('0 */10 * * * *', () => {
		console.log('Zoom job running')
		Session.find({ type: 'processing' })
			.populate('mentor')
			.populate('mentee')
			.then(sessions => {
				console.log('sessions to be processed:')
				console.log(sessions.length)
				for (let i = 0; i < sessions.length; i++) {
					const session = sessions[i]
					gateway.transaction.find(session.transaction_id, (err, transaction) => {
						if (err) return
						console.log('session: ' + i)
						console.log('transaction status:')
						console.log(transaction.status)
						if (transaction.status === 'settled')
							Zoom.meeting.create({
								host_id: session.mentor.ZoomId,
								type: 2,
								topic: 'Mentoring Session',
								start_time: moment.utc(session.start).format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
								timezone: 'UTC',
								duration: (moment(session.end) - moment(session.start)) / 60000,
							}, response => {
								if (response.error) return
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
									})
							})
						else if (transaction.status !== 'submitted_for_settlement' && transaction.status !== 'settling' && transaction.status !== 'authorized') {
							console.log('session payment error, setting to error')
							session.type = 'payment_error'
							session.color = 'grey'
							session.save()
						}
					})

				}
			})
	}, () => {
		console.log('Zoom job finished')
	},
	true,
	'America/Toronto'
	)


module.exports = job

var CronJob = require('cron').CronJob,
	moment = require('moment'),
	Session = require('../passport/models/session'),
	job = new CronJob('0 */10 * * * *', () => {
		console.log('Daily session job running')
		Session.find({
			$or: [ {
				$and: [ {
					$or: [ { type: 'available' },
						{ type: 'requested' } ],
				}, { start: { $lte: moment.utc().add(24, 'h') } } ],
			}, {
				$and: [ { type: 'scheduled' },
					{ start: { $lte: moment.utc() } } ],
			} ],

		})
			.then(sessions => {
				console.log('sessions to be processed:')
				console.log(sessions.length)
				for (let i = 0; i < sessions.length; i++) {
					const session = sessions[i]
					if (session.type !== 'scheduled') {
						session.mentee = undefined
						session.paymentMethodToken = ''
					}
					session.type = 'expired'
					session.color = 'grey'
					session.save()
				}
			})
			.catch(err => {
				console.log(err)
			})
	}, () => {
		console.log('Daily session job finished')
	},
	true,
	'America/New_York'
	)


module.exports = job

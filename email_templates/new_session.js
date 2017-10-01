const fs = require('fs'),
	path = require('path'),
	moment = require('moment')

module.exports = function (mentor, mentee, session, hostname) {
	const html = fs.readFileSync(path.join(__dirname, './new_session.html'), 'utf8'),
		text = fs.readFileSync(path.join(__dirname, './new_session.txt'), 'utf8')
	return {
		FromEmail: 'admin@mentormap.ca',
		FromName: 'MentorMap Admin',
		Subject: 'MentorMap - You have a new session request!',
		'Text-part': text
			.replace(/%name/g, mentor.profile.first_name + ' ' + mentor.profile.last_name),
		'Html-part': html
			.replace('%start', moment(session.start).format('MMM Do, YYYY HH:mm:ss'))
			.replace('%end', moment(session.end).format('MMM Do, YYYY HH:mm:ss'))
			.replace(/%link/g, 'https://mentormap.ca/auth/login')
			.replace('%name', mentee.profile.first_name + ' ' + mentee.profile.last_name),
		Recipients: [
			{ Email: mentor.email },
		],
	}
}

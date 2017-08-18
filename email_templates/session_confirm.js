const fs = require('fs'),
	path = require('path'),
	moment = require('moment')

module.exports = function (mentor, mentee, session, hostname) {
	const html = fs.readFileSync(path.join(__dirname, './session_confirm.html'), 'utf8'),
		text = fs.readFileSync(path.join(__dirname, './session_confirm.txt'), 'utf8')
	console.log(mentee.email)
	return {
		FromEmail: 'admin@mentormap.ca',
		FromName: 'MentorMap Admin',
		Subject: 'MentorMap - Your Session Has Been Confirmed!',
		'Text-part': text
			.replace('%name', mentor.profile.first_name + ' ' + mentor.profile.last_name)
			.replace('%mentee_name', mentee.profile.first_name + ' ' + mentee.profile.last_name)
			.replace(/%link/g, 'http://mentormap.ca/auth/login'),
		'Html-part': html
			.replace('%start', moment(session.start).format('MMM Do, YYYY HH:mm:ss'))
			.replace('%end', moment(session.end).format('MMM Do, YYYY HH:mm:ss'))
			.replace(/%link/g, 'http://mentormap.ca/auth/login')
			.replace('%name', mentee.profile.first_name + ' ' + mentee.profile.last_name)
			.replace('%zoom', session.startURL),
		Recipients: [
			{ Email: mentor.email },
		],
	}
}

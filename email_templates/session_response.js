const fs = require('fs'),
	path = require('path'),
	moment = require('moment')

module.exports = function (mentor, mentee, session, decision, hostname) {
	const html = fs.readFileSync(path.join(__dirname, './session_response.html'), 'utf8'),
		text = fs.readFileSync(path.join(__dirname, './session_response.txt'), 'utf8')
	console.log(mentee.email)
	return {
		FromEmail: 'admin@mentormap.ca',
		FromName: 'MentorMap Admin',
		Subject: 'MentorMap - Your Mentor Has Responded!',
		'Text-part': text
			.replace('%name', mentee.profile.first_name + ' ' + mentee.profile.last_name)
			.replace('%decision', decision)
			.replace('%mentor_name', mentor.profile.first_name + ' ' + mentor.profile.last_name)
			.replace('%zoom', session.joinURL),
		'Html-part': html
			.replace('%decision', decision)
			.replace('%start', moment(session.start).format('MMM Do, YYYY HH:mm:ss'))
			.replace('%end', moment(session.end).format('MMM Do, YYYY HH:mm:ss'))
			.replace(/%link/g, 'https://mentormap.ca/auth/login')
			.replace('%name', mentor.profile.first_name + ' ' + mentor.profile.last_name)
			.replace('%zoom', session.joinURL || 'Not Available'),
		Recipients: [
			{ Email: mentee.email },
		],
	}
}

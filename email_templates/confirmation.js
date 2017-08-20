const fs = require('fs'),
	path = require('path')

module.exports = function (user, hostname) {
	const html = fs.readFileSync(path.join(__dirname, './confirmation.html'), 'utf8'),
		text = fs.readFileSync(path.join(__dirname, './confirmation.txt'), 'utf8'),
		link = 'http://' + hostname + '/auth/verify/' + user._id
	return {
		FromEmail: 'admin@mentormap.ca',
		FromName: 'MentorMap Admin',
		Subject: 'MentorMap - Confirm Your Email Address!',
		'Text-part': text
			.replace('%email', user.email)
			.replace('%link', link)
			.replace(/%name/g, user.profile.first_name + ' ' + user.profile.last_name),
		'Html-part': html
			.replace('%email', user.email)
			.replace(/%link/g, link)
			.replace('%name', user.profile.first_name + ' ' + user.profile.last_name),
		Recipients: [
			{ Email: user.email },
		],
	}
}

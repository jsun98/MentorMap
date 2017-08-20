const mailjet = require('node-mailjet')
	.connect(process.env.MAILJET_KEY, process.env.MAILJET_SECRET)

module.exports = mailjet

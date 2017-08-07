// app/models/user.js
// load the things we need
const mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	random = require('mongoose-random')

// define the schema for our user model

var userSchema = new mongoose.Schema({
	email: String,
	password: String,
	role: String,
	verified: Boolean,
	completed: Boolean,
	creation_date: Date,
	upcomingSessions: [ {
		type: mongoose.Schema.ObjectId,
		ref: 'Session',
	} ],
	mentors: [ {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	} ],
	mentees: [ {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	} ],

	profile: {
		// common info

		gender: String,
		first_name: String,
		last_name: String,
		phone: String,
		age: Number,
		linkedin: String,
		high_school_program: [ String ],
		skills: [ String ],
		paragraphs: [ String ],


		// mentee
		avg_11: Number,
		avg_12: Number,
		high_school: String,
		grade: Number,
		preferred_school: [ String ],
		preferred_program: [ String ],


		// mentor
		gpa: Number,
		curr_school: String,
		curr_major: String,
		curr_minor: String,
		grad_year: Number,
	},
})
userSchema.plugin(random, { path: 'r' })

// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password)
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema)

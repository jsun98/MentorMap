// app/models/user.js
// load the things we need
const mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	random = require('mongoose-random')

// define the schema for our user model

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: [ 'mentor', 'mentee' ],
		required: true,
		default: 'mentee',
	},
	verified: {
		type: Boolean,
		required: true,
		default: false,
	},
	completed: {
		type: Boolean,
		required: true,
		default: false,
	},
	creation_date: {
		type: Date,
		required: true,
		default: Date(),
	},
	ZoomId: String,
	BrainTreeId: String,

	profile: {
		// common info

		gender: {
			type: String,
			enum: [ 'male', 'female' ],
		},
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		phone: String,
		age: {
			type: Number,
			min: 14,
			max: 29,
		},
		linkedin: String,
		high_school_program: [ {
			type: String,
			enum: [ 'AP', 'IB', 'TOPS', 'ESL' ],
		} ],
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

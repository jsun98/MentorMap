const mongoose = require('mongoose')

var sessionSchema = new mongoose.Schema({
	creation_date: {
		type: Date,
		default: Date(),
		required: true,
	},
	title: {
		type: String,
		enum: [ 'available', 'taken', 'completed' ],
		default: 'available',
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
	mentor: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
	mentee: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
})

module.exports = mongoose.model('Session', sessionSchema)

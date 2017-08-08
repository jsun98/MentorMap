const mongoose = require('mongoose')

var sessionSchema = new mongoose.Schema({
	creation_date: {
		type: Date,
		default: Date(),
		required: true,
	},
	title: {
		type: String,
		default: 'Session Slot',
	},
	type: {
		type: String,
		enum: [ 'available', 'taken', 'expired' ],
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
	color: {
		type: String,
		required: true,
		enum: [ 'red', 'green', 'orange' ],
		default: 'green',
	},
})

module.exports = mongoose.model('Session', sessionSchema)

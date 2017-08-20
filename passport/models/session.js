const mongoose = require('mongoose')

var sessionSchema = new mongoose.Schema({
	creation_date: {
		type: Date,
		default: Date(),
		required: true,
	},
	type: {
		type: String,
		enum: [ 'available', 'requested', 'processing', 'scheduled', 'payment_error', 'expired' ],
		default: 'available',
	},
	paymentMethodToken: String,
	transaction_id: String,
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
	startURL: String,
	joinURL: String,
	color: {
		type: String,
		required: true,
		enum: [ 'red', 'green', 'orange', 'grey', 'yellow' ],
		default: 'green',
	},
})

module.exports = mongoose.model('MentorSession', sessionSchema)

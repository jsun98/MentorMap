const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	mentorshipSchema = new Schema({
		mentee: {
			type: Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		mentor: {
			type: Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		creation_date: {
			type: Date,
			default: new Date(),
			required: true,
		},
		termination_date: Date,
		status: {
			type: String,
			enum: [ 'active', 'terminated', 'expired' ],
			required: true,
			default: 'active',
		},
	})

module.exports = mongoose.model('Mentorship', mentorshipSchema)

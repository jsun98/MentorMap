var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model

var sessionSchema = new mongoose.Schema();

sessionSchema.add({
  creation_date: Date,
  type: String,
  purpose: String,
  date: Date,
  startTime: String,
  endTime: String,
  mentor : {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  mentee : {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
});

// methods ======================
// generating a hash
sessionSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('Session', sessionSchema);

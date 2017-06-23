// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    mentee: {
        email                     : String,
        gender                    : String,
        password                  : String,
        first_name                : String,
        last_name                 : String,
        phone                     : String,
        avg_11                    : Number,
        avg_12                    : Number,
        high_school               : String,
        grade                     : Number,
        linkedin                  : String,
        high_school_programs      : [String],
        skills                    : [String],
        preferred_school          : [String],
        preferred_program         : [String],
        paragraphs                : [String],
    },

    mentor: {
        email                     : String,
        gender                    : String,
        password                  : String,
        first_name                : String,
        last_name                 : String,
        phone                     : String,
        gpa                       : Number,
        dob                       : Date,
        linkedin                  : String,
        skills                    : [String],
        paragraphs                : [String],
        curr_school               : String,
        curr_school_type          : String,
        curr_major                : String,
        curr_minor                : String,
        grad_year                 : Number,
        high_school_programs      : [String],
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

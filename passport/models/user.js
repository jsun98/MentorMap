// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
      email                     : String,
      password                  : String,
      role                      : String,
      completed                 : Boolean,
      creation_date             : Date,

      profile : {
        //common info

        gender                    : String,
        first_name                : String,
        last_name                 : String,
        phone                     : String,
        age                       : Number,
        high_school_program       : [String],
        skills                    : [String],
        paragraphs                : [String],

        //mentee
        avg_11                    : Number,
        avg_12                    : Number,
        high_school               : String,
        grade                     : Number,
        preferred_school          : [String],
        preferred_program         : [String],


        //mentor
        gpa                       : Number,
        curr_school               : String,
        curr_major                : String,
        curr_minor                : String,
        grad_year                 : Number
      }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

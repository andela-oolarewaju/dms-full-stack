m// get dependencies
var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isLowercase, 'should be lowercase']
  },
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'invalid email']
  },
  password: {
    type: String,
    required: true
  },
});

//hash password
userSchema.pre('save', function(next) {
  var user = this;
  //hash the password only if the password has been changed or user is new
  if (!user.isModified('password')) {
    return next();
  }
  //capitalize user first and last name before saving to database
  var firstToUpper = user.name.first.charAt(0).toUpperCase() + user.name.first.slice(1);
  var lastToUpper = user.name.last.charAt(0).toUpperCase() + user.name.last.slice(1);
  user.name.first = firstToUpper;
  user.name.last = lastToUpper;

  //generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      return next(err);
    }

    //change the password to the hashed version
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', userSchema);

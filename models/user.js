
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate function to check e-mail length
var emailLengthChecker = function(email){
  if (!email) {
    return false;
  } else {
    if (email.length < 5 || email.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

// Validate Function to check if valid e-mail format
var validEmailChecker = function (email) {
  if (!email) {
    return false;
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

// Array of Email Validators
const emailValidators = [
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// Validate function to check username length
var usernameLengthChecker = function(username) {
  if (!username) {
    return false;
  } else {
    if (username.length < 3 || username.length > 15) {
      return false;
    } else {
      return true;
    }
  }
};

// Validate function to check if valid username format
var validUsername = function(username) {
  if (!username) {
    return false;
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
};

// Array of Username validators
const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 15'
  },
  {
    validator: validUsername,
    message: 'Username must not have any special characters'
  }
];

// Validate function to check password length
var passwordLengthChecker = function(password) {
  if (!password) {
    return false;
  } else {
    return !(password.length < 8 || password.length > 35);
  }
};

// Validate function to check if valid password format
var validPassword = function(password){
  if (!password) {
    return false;
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password);
  }
};

// Array of Password validators
const passwordValidators = [
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

// User Model Definition
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
  password: { type: String, required: true, validate: passwordValidators },
    isAdmin: { type: Boolean, default: false}

});



// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password) {
    return password === this.password;
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);

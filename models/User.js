const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  email: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  }
});

module.exports = User = mongoose.model('users', UserSchema);

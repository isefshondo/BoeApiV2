const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  farm_id: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: false,
  },
  signUpDate: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  userSchema,
};

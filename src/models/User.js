const mongoose = require('mongoose')

const { Schema } = mongoose

// TODO: Add a match for every value that needs a validation

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
  userSchema,
}

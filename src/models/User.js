const mongoose = require('mongoose')

const { Schema } = mongoose

// TODO: Add a match for every value that needs a validation
// TODO: Add the password field to the schema and discover its type

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
  userSchema,
}

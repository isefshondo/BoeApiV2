const mongoose = require('mongoose')

const { Schema } = mongoose

const animalSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    user_token: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        required: false,
    },

})

const Animal = mongoose.model('Animal', animalSchema)

module.exports = {
    Animal,
    animalSchema,
}
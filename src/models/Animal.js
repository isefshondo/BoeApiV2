const mongoose = require('mongoose')

const { Schema } = mongoose

const animalSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    disease_name: {
        type: String,
        requires: true,
    },
    infection_level: {
        type: Number,
        requires: true,
    }

})

const Animal = mongoose.model('Animal', animalSchema)

module.exports = {
    Animal,
    animalSchema,
}
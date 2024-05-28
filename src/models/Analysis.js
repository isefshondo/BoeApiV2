const mongoose = require('mongoose')

const { Schema } = mongoose

const analysisSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    animal_id: {
        type: String,
        required: true,
    },
    user_token: {
        type: String,
        required: true,
    },
    analysis_img: {
        type: Buffer,
        required: true,
    },
    analysis_date: {
        type: Date,
        required: true,
    },
    disease_class: {
        type: String,
        required: true,
    },
    accuracy: {
        type: Number,
        required,
    },
})

const Analysis = mongoose.model('Analysis', analysisSchema)

module.exports = {
    Analysis,
    analysisSchema,
}
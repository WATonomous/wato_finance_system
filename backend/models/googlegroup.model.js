const mongoose = require('mongoose')

const { Schema } = mongoose

const GoogleGroupSchema = new Schema({
    email: { type: String },
    watiam: { type: String },
    title: { type: String, required: true },
})

const GoogleGroup = mongoose.model('GoogleGroup', GoogleGroupSchema)

module.exports = GoogleGroup

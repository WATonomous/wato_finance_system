const mongoose = require('mongoose')

const { Schema } = mongoose

const GoogleGroupSchema = new Schema({
    email: { type: String },
    title: { type: String },
})

const GoogleGroup = mongoose.model('GoogleGroup', GoogleGroupSchema)

module.exports = GoogleGroup

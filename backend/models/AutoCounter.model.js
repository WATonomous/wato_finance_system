const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AutoCounterSchema = new Schema(
    {
        _id: { type: String, required: true },
        seq: { type: Number, default: 0 },
    }
)

const AutoCounter = mongoose.model('AutoCounter', AutoCounterSchema)

module.exports = AutoCounter

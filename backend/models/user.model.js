// THIS IS AN EXAMPLE FILE - WILL BE DELETED
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        // password: { type: String, required: true },
        // duration: { type: Number, required: true },
        // date: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User

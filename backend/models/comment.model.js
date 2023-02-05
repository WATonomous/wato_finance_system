const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = mongoose.Schema.Types

const CommentSchema = new Schema(
    {
        _id: { type: String, required: true },
        ticketType: {
            type: String,
            required: true,
            enum: ['PPR', 'UPR', 'FI', 'SF'],
        },
        ticketId: { type: Number, required: true },
        commentBlob: { type: String, required: true }, //stringified JSON
        userEmail: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment

const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new Schema(
    {
        // reference_code would be parent ticket here
        reference_code: { type: String, index: true },
        commment: { type: String },
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment

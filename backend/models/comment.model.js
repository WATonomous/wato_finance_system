const mongoose = require('mongoose')
const { Schema } = mongoose

const Mixed = Schema.Types.Mixed

//sort by new -> old for parent comments, old -> new for replies
const CommentSchema = new Schema(
    {
        // reference_code would be parent ticket/parent comment here
        reference_code: { type: String, index: true, required: true },
        comment: { type: [Mixed], required: true },
        author_id: {type: String, required: true},
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment

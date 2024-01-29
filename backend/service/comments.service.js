const Comment = require('../models/comment.model')

const createComment = async (body) => {
    const comment = new Comment(body)
    const newComment = await comment.save()
    return newComment
}

const getAllComments = async (code) => {
    //add reply aggregation, sortby
    const res = await Comment.aggregate([
        {
            $match: {
                reference_code: code,
            },
        },
        {
            $lookup: {
                from: 'comments',
                let: { idStr: { $toString: '$_id' } }, // Define variable for use in the pipeline
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$reference_code', '$$idStr'] }, // Use the variable to match documents
                        },
                    },
                    { $sort: { createdAt: 1 } }, // Sort matching documents in ascending order
                ],
                as: 'replies',
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $set: {
                replies: '$replies',
            },
        },
    ])
    return res
}

module.exports = {
    createComment,
    getAllComments,
}

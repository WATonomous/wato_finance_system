const Comment = require("../models/comment.model")

const createComment = async (body) => {
    const comment = new Comment(body)
    console.log(body.comment)
    console.log(comment['comment'])
    const newComment = await comment.save()
    return newComment
}

const getAllComments = async (code) => { //add reply aggregation, sortby
    const res = await Comment.find({reference_code: code}).sort({createdAt: -1})
    console.log(res)
    console.log(code)
    return res
}

module.exports = {
    createComment,
    getAllComments,
}
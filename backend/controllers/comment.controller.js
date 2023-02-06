const Comment = require('../models/comment.model')
const ObjectId = require('mongodb').ObjectId

const getAllCommentsForTicket = async (req, res) => {
    const { ticketType, ticketId } = req.params
    try {
        const comments = await Comment.find({
            ticketType: ticketType,
            tickedId: ticketId,
        })
        res.json(comments)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const createComment = async (req, res) => {
    const { body } = req
    const newComment = new Comment(body)
    try {
        const result = await newComment.save()
        res.json(result)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const deleteCommentById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await Comment.findByIdAndDelete(id)
        res.json(result)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const createNewCommentId = (_, res) => {
    const newId = new ObjectId()
    res.send({ _id: newId.toString() })
}
// const updateComment = (req, res) => {
//     const body = { ...req.body, _id: req.params.id }
//     Comment.findByIdAndUpdate(req.params.id, body)
// }

module.exports = {
    getAllCommentsForTicket,
    createComment,
    deleteCommentById,
    createNewCommentId,
}

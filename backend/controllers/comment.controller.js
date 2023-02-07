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

const updateCommentById = async (req, res) => {
    const { id } = req.params
    const { body } = req
    console.log(body)
    try {
        const result = await Comment.updateOne(
            { _id: id },
            { $set: { commentBlob: body.commentBlob } }
        )
        console.log(result)
        res.json(result)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const createNewCommentId = (_, res) => {
    const newId = new ObjectId()
    res.send({ _id: newId.toString() })
}

module.exports = {
    getAllCommentsForTicket,
    createComment,
    deleteCommentById,
    createNewCommentId,
    updateCommentById,
}

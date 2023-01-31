const Comment = require('../models/comment.model')

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
    console.log(body)
    try {
        const result = await newComment.save()
        res.json(result)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

// const updateComment = (req, res) => {
//     const body = { ...req.body, _id: req.params.id }
//     Comment.findByIdAndUpdate(req.params.id, body)
// }

module.exports = { getAllCommentsForTicket, createComment }

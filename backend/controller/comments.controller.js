const { createComment, getAllComments } = require('../service/comments.service')

const getAllCommentsController = (req, res) => {
    const ticketID = req.params.id
    getAllComments(ticketID)
        .then((data) => res.send(data))
        .catch((err) => {
            res.status(500).send(err)
            console.log(err)
        })
}

const createCommentController = (req, res) => {
    createComment(req.body)
        .then((data) => {
            console.log(data)
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send(error)
        })
}

module.exports = {
    createCommentController,
    getAllCommentsController,
}

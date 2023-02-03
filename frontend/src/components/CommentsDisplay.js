import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Element, Leaf, CommentMessage } from './RenderComment'
import { Box } from '@chakra-ui/react'

const CommentsDisplay = (props) => {
    const { ticketType, ticketId, allUsers } = props
    const [allComments, setAllComments] = useState([])
    const getUser = (email) => {
        const user = allUsers.users.find((user) => user.email === email)
        return user
    }

    //mongoDB most likely already sorted by timestamp, but just in case
    const sortMessagesByTimestamp = (comments) => {
        comments.sort((a, b) => {
            let dateA = new Date(a.createdAt)
            let dateB = new Date(b.createdAt)
            if (dateA.getTime() < dateB.getTime()) {
                return -1
            } else {
                return 1
            }
        })
        return comments
    }
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/comments/${ticketType}/${ticketId}`
                )
                setAllComments(sortMessagesByTimestamp(response.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchComments().catch(console.error)
    }, [])

    return (
        <div>
            {allComments.map((comment) => {
                const user = getUser(comment.userEmail)
                console.log(user)
                return (
                    <Box value={comment._id}>
                        <div>{user.displayName}</div>
                        <CommentMessage
                            comment={JSON.parse(comment.commentBlob)}
                        />
                    </Box>
                )
            })}
        </div>
    )
}

export default CommentsDisplay

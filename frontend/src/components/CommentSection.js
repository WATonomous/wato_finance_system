import React, { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import CommentsDisplay from './CommentsDisplay'
import RichTextEditor from './RichTextEditor'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
const CommentSection = (props) => {
    const { currentUser } = useAuth()
    const { ticketType, ticketId, allUsers } = props
    const [allComments, setAllComments] = useState([])

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
        <Box>
            {allUsers.users && allUsers.users.length > 0 && (
                <CommentsDisplay
                    allUsers={allUsers}
                    allComments={allComments}
                    setAllComments={setAllComments}
                />
            )}
            <Box marginLeft="55px">
                <RichTextEditor
                    ticketType={ticketType}
                    ticketId={ticketId}
                    currentUser={currentUser}
                    allComments={allComments}
                    setAllComments={setAllComments}
                />
            </Box>
        </Box>
    )
}

export default CommentSection

import React, { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import CommentsDisplay from './CommentsDisplay'
import { RichTextEditor } from './RichTextEditor'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
const CommentSection = (props) => {
    const { currentUser } = useAuth()
    const { ticketType, ticketId, allUsers } = props
    const [allComments, setAllComments] = useState([])

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/comments/${ticketType}/${ticketId}`
                )
                //mongoDB most likely already sorted by created timestamp
                setAllComments(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchComments().catch(console.error)
    }, [ticketType, ticketId])

    return (
        <Box>
            {allUsers.users &&
                allUsers.users.length > 0 &&
                allComments.length > 0 && ( //this is to prevent the component from rendering before the data is fetched
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

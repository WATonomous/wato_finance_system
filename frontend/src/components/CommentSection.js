// modified version of https://github.com/ianstormtaylor/slate/blob/main/site/examples/richtext.tsx
import React, { useState, useEffect } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { axiosPreset } from '../axiosConfig'
import CommentInput from './CommentInput'
import CommentView from './CommentView'

const CommentSection = ({ ticket, allUsers }) => {
    const [comments, setComments] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    const [loading, setLoading] = useState(false)

    const forceRefresh = () => {
        setRefreshKey((oldKey) => oldKey + 1)
    }

    const getComments = async (ref) => {
        setLoading(true)
        axiosPreset
            .get('/comments/' + ref)
            .then((data) => {
                setComments([...data.data])
                forceRefresh()
                console.log(data)
            })
            .then(() => {
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getComments(ticket)
    }, [ticket])

    return (
        <Box mt="50px" mb="50px">
            <Box
                fontWeight="bold"
                fontSize="30px"
                textAlign="left"
                marginLeft="5px"
            >
                Comments
            </Box>
            <div key={refreshKey}>
                <CommentInput
                    getComments={getComments}
                    ticket={ticket}
                    code={ticket}
                    type={'main'}
                />
                <Box display="flex" alignItems="center" flexDirection="column">
                    {loading && (
                        <Spinner speed="0.65s" margin="50px" size="xl" />
                    )}
                    <Box width="100%">
                        {comments.map((content, index) => {
                            return (
                                <CommentView
                                    key={
                                        'comment-' +
                                        (comments.length - index).toString() +
                                        ticket
                                    }
                                    comment={content}
                                    allUsers={allUsers}
                                    getComments={getComments}
                                />
                            )
                        })}
                    </Box>
                </Box>
            </div>
        </Box>
    )
}

export default CommentSection

/**
 * To do:
 * seperate the comment editor from comment section
 * make component for actual comments
 * make component for replies (view replies, hide replies?)
 * make component for replying to comment vs new comment in general
 */

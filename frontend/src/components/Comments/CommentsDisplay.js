import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Element, Leaf, CommentMessage } from './RenderComment'
import { Box, HStack, Image, Flex, Text } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
const CommentsDisplay = (props) => {
    const { allUsers, allComments, setAllComments } = props

    const [editComments, setEditComments] = useState(
        Array(allComments.length).fill(false)
    )

    useEffect(() => {
        setEditComments(Array(allComments.length).fill(false))
    }, [allComments])

    const deleteComment = async (commentID) => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/comments/${commentID}`
            )
            const newComments = allComments.filter(
                (comment) => comment._id !== commentID
            )
            setAllComments(newComments)
        } catch (error) {
            console.log(error)
        }
    }

    const [images, setImages] = useState([])
    //not confirmed if this works, need further testing -> idea is to render the image url when it is used so it would display properly
    const handleLoad = (url) => {
        const newImages = [...images]
        setImages(newImages.push(url))
    }

    return (
        <div>
            {allComments.map((comment, i) => {
                const user = allUsers.users.find(
                    (user) => user.email === comment.userEmail
                )
                const commentID = comment._id
                const currentTime = new Date()
                const date = comment.createdAt
                    ? new Date(comment.createdAt)
                    : currentTime
                let day = date.toLocaleDateString()
                let time = date.toLocaleTimeString()

                if (
                    date.toLocaleDateString() ===
                    currentTime.toLocaleDateString()
                ) {
                    day = 'Today at'
                } else if (
                    date.getFullYear() === currentTime.getFullYear() &&
                    date.getMonth() === currentTime.getMonth() &&
                    date.getDate() === currentTime.getDate() - 1
                ) {
                    day = 'Yesterday at'
                }
                return (
                    // A key is very important to ensure deletion happens to the correct div
                    <Flex marginBottom="20px" key={commentID}>
                        <Image
                            onLoad={() => {
                                handleLoad(user.photoURL)
                            }}
                            borderRadius="full"
                            boxSize="35px"
                            src={user.photoURL}
                            alt={user.displayName}
                            marginRight="20px"
                        />
                        <Box
                            value={comment._id}
                            minWidth="800px"
                            bgColor="orange.100"
                            rounded="10px"
                            position="relative"
                        >
                            <Box
                                position="absolute"
                                top="17px"
                                left="-3"
                                transform="translateY(-50%)"
                                width="0"
                                height="0"
                                border="solid transparent"
                                borderWidth="0.75em 1em 0.75em 0"
                                borderRightColor="orange.200"
                            />
                            <HStack
                                paddingX="3"
                                paddingY="1"
                                bgColor="orange.200"
                                roundedTop="10px"
                                justifyContent="space-between"
                            >
                                <HStack>
                                    <Text as="b">{user.displayName}</Text>
                                    <Text fontSize="sm">
                                        {' '}
                                        {day +
                                            ' ' +
                                            time.substring(0, time.length - 6) +
                                            time.substring(time.length - 3)}
                                        {/* covers cases for 12:00 PM vs 4:00 PM */}
                                    </Text>
                                </HStack>
                                <EditIcon
                                    cursor="pointer"
                                    onClick={() => {
                                        const newEditComments = [
                                            ...editComments,
                                        ]
                                        newEditComments[i] = true
                                        setEditComments(newEditComments)
                                    }}
                                />
                                <DeleteIcon
                                    cursor="pointer"
                                    onClick={() => {
                                        deleteComment(commentID)
                                    }}
                                />
                            </HStack>
                            <CommentMessage
                                index={i}
                                comment={comment}
                                editComments={editComments}
                                setEditComments={setEditComments}
                            />
                        </Box>
                    </Flex>
                )
            })}
        </div>
    )
}

export default CommentsDisplay

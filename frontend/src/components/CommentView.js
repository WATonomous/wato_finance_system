import React, { useState } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
    Text,
    Image,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    HStack,
} from '@chakra-ui/react'

import { Element, Leaf } from './SlateComponents'
import CommentInput from './CommentInput'

const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.round((now - date) / 1000)
    const minutes = Math.round(seconds / 60)
    const hours = Math.round(minutes / 60)
    const days = Math.round(hours / 24)
    const weeks = Math.round(days / 7)
    const months = Math.round(days / 30.44) // Average days per month
    const years = Math.round(days / 365)

    if (seconds < 60) {
        return 'Just now'
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (weeks < 4.35) {
        // Approximate weeks in a month
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else if (months < 12) {
        return `${months} month${months > 1 ? 's' : ''} ago`
    } else {
        return `${years} year${years > 1 ? 's' : ''} ago`
    }
}

const UserInfoPopUp = ({ author, img }) => {
    return (
        <Popover trigger="hover" closeDelay={200} placement="top-start">
            <PopoverTrigger>
                <Box>
                    {!img && (
                        <Text
                            fontSize={{ base: 'sm', md: 'md' }}
                            cursor="pointer"
                            fontWeight="bold"
                            style={{
                                fontWeight: 'bold',
                                fontSize: '15px',
                                fontFamily: 'arial',
                            }}
                        >
                            {author.displayName}
                        </Text>
                    )}
                    {img && (
                        <img
                            style={{
                                height: '35px',
                                width: '35px',
                                minWidth: '35px',
                                borderRadius: '100%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                            src={author.photoURL}
                        />
                    )}
                </Box>
            </PopoverTrigger>
            <PopoverContent zIndex="tooltip" width="auto">
                <Box px={4} py={4}>
                    <HStack spacing="12px">
                        <Image
                            boxSize="50px"
                            objectFit="cover"
                            src={author.photoURL}
                            alt="reporter photo"
                        />
                        <Box flex="1">
                            <Text
                                fontSize={{
                                    base: 'sm',
                                    md: 'md',
                                    lg: 'lg',
                                }}
                                as="b"
                                color="blue.600"
                            >
                                {author.displayName}
                            </Text>
                            <br />
                            <Text
                                fontSize={{ base: 'xs', md: 'sm' }}
                                as="u"
                                color="gray.600"
                            >
                                {author.email}
                            </Text>
                        </Box>
                    </HStack>
                </Box>
            </PopoverContent>
        </Popover>
    )
}

const ReplyView = ({ comment, allUsers, getComments, parent }) => {
    const editor = React.useMemo(
        () => withReact(withHistory(createEditor())),
        []
    )
    const author = allUsers.users.find((user) => user.uid === comment.author_id)
    const renderElement = React.useCallback(
        (props) => <Element {...props} />,
        []
    )
    const renderLeaf = React.useCallback((props) => <Leaf {...props} />, [])
    const [showInput, setShowInput] = useState(false)

    return (
        <div style={{ display: 'flex', gap: '15px', padding: '10px' }}>
            <UserInfoPopUp author={author} img={true} />
            <div style={{ width: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                    }}
                >
                    <UserInfoPopUp author={author} img={false} />
                    <div style={{ fontSize: '12px', color: 'grey' }}>
                        {timeAgo(comment.createdAt)}
                    </div>
                </div>
                <Slate
                    editor={editor}
                    initialValue={comment.comment}
                    children={comment.comment}
                >
                    <Editable
                        readOnly
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                    />
                </Slate>
                <div
                    style={{
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'grey',
                        width: '29px',
                        userSelect: 'none',
                    }}
                    onClick={() => setShowInput(!showInput)}
                >
                    reply
                </div>
                {showInput && (
                    <CommentInput
                        reply={showInput}
                        onClose={() => setShowInput(false)}
                        ticket={parent.reference_code}
                        code={parent._id}
                        getComments={getComments}
                    />
                )}
            </div>
        </div>
    )
}

const CommentView = ({ comment, allUsers, getComments }) => {
    const editor = React.useMemo(
        () => withReact(withHistory(createEditor())),
        []
    )
    const author = allUsers.users.find((user) => user.uid === comment.author_id)
    const renderElement = React.useCallback(
        (props) => <Element {...props} />,
        []
    )
    const renderLeaf = React.useCallback((props) => <Leaf {...props} />, [])
    const [showInput, setShowInput] = useState(false)

    return (
        <div style={{ display: 'flex', gap: '15px', padding: '10px' }}>
            <UserInfoPopUp author={author} img={true} />
            <div style={{ width: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '2px',
                    }}
                >
                    <UserInfoPopUp author={author} img={false} />
                    <div style={{ fontSize: '12px', color: 'grey' }}>
                        {timeAgo(comment.createdAt)}
                    </div>
                </div>
                <Slate
                    editor={editor}
                    initialValue={comment.comment}
                    children={comment.comment}
                >
                    <Editable
                        readOnly
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                    />
                </Slate>
                <div
                    style={{
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'grey',
                        width: '29px',
                        userSelect: 'none',
                    }}
                    onClick={() => setShowInput(!showInput)}
                >
                    reply
                </div>
                {showInput && (
                    <CommentInput
                        reply={showInput}
                        onClose={() => setShowInput(false)}
                        ticket={comment.reference_code}
                        code={comment._id}
                        getComments={getComments}
                    />
                )}
                {comment.replies.map((reply) => {
                    return (
                        <ReplyView
                            parent={comment}
                            comment={reply}
                            allUsers={allUsers}
                            getComments={getComments}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default CommentView

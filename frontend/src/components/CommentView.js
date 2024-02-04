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
import { timeAgo } from '../utils/utils'
import { Element, Leaf } from './SlateComponents'
import CommentInput from './CommentInput'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from '@chakra-ui/react'

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

const CommentView = ({ comment, allUsers, getComments, parent }) => {
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
    const [showReplies, setShowReplies] = useState(null) //Number means number of replies to show

    return (
        <div
            style={{
                display: 'flex',
                gap: '15px',
                paddingTop: '10px',
                paddingLeft: parent? '0px' : '10px',
                paddingBottom: '10px',
            }}
        >
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
                <div style={{display: 'flex', gap: '10px'}}>
                    <div style={{
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'grey',
                        userSelect: 'none',
                    }}
                    onClick={() => setShowInput(!showInput)}>reply</div>
                    {!parent && showReplies != false && <Box fontSize='12px' color='grey' cursor='pointer' onClick={() => {setShowReplies(false)}}>hide replies</Box>}
                    {!parent && showReplies == false && <Box fontSize='12px' color='grey' cursor='pointer' onClick={() => setShowReplies(true)}>show replies</Box>}
                    <Menu>
                        <MenuButton style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        marginTop: '-11px',
                        color: 'grey',
                        userSelect: 'none',
                    }}>
                            ...
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Delete</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
                {showInput && (
                    <CommentInput
                        reply={showInput}
                        onClose={() => setShowInput(false)}
                        ticket={parent? parent.reference_code : comment.reference_code}
                        code={parent? parent._id : comment._id}
                        getComments={getComments}
                    />
                )}
                {!parent && showReplies != false && comment.replies?.map((reply, index) => {
                    if (showReplies == true || (showReplies == null && index < 2)) {
                        return (
                            <CommentView
                                parent={comment}
                                comment={reply}
                                allUsers={allUsers}
                                getComments={getComments}
                            />
                        )
                    }
                })}
                {!parent && showReplies == null && comment.replies?.length > 2 && <Box fontSize='12px' color='grey' cursor='pointer' onClick={() => setShowReplies(true)}>show more replies</Box>}
                {!parent && showReplies == true && <Box fontSize='12px' color='grey' cursor='pointer' onClick={() => {setShowReplies(false)}}>hide replies</Box>}
            </div>
        </div>
    )
}

export default CommentView

//TODO, isAuthor function that checks if comment is made by user
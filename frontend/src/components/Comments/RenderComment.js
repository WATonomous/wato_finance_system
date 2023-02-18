import React, { useState } from 'react'
import {
    Text,
    UnorderedList,
    OrderedList,
    ListItem,
    Box,
} from '@chakra-ui/react'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { useCallback, useMemo } from 'react'
import { EditorComponent } from './RichTextEditor'
import axios from 'axios'
export const CommentMessage = (props) => {
    const { index, comment, editComments, setEditComments, edited, setEdited } =
        props

    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [value, setValue] = useState(JSON.parse(comment.commentBlob))
    const isEdit = editComments[index]

    const updateComment = async () => {
        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/comments/${comment._id}`,
                {
                    commentBlob: JSON.stringify(value),
                }
            )
            const newEditComments = [...editComments]
            newEditComments[index] = false
            setEditComments(newEditComments)
            const newEdited = [...edited]
            newEdited[index] = true
            setEdited(newEdited)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Box position="relative" p="1em" rounded="lg">
            {isEdit && (
                <Box>
                    <EditorComponent
                        value={value}
                        setValue={setValue}
                        editor={editor}
                    />
                    <button onClick={() => updateComment()}>update</button>
                </Box>
            )}
            {!isEdit && (
                <Slate value={value} editor={editor}>
                    <Editable
                        readOnly={true}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        value={value}
                    />
                </Slate>
            )}
        </Box>
    )
}

export const Element = ({ children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return (
                <Text
                    display="block"
                    align={element.align}
                    marginBlockStart="1em"
                    marginBlockEnd="1em"
                    marginInlineStart="20px"
                    marginInlineEnd="20px"
                    borderLeft="2px solid #ccc"
                    marginLeft="1em 10px"
                    padding="0.2em 10px"
                >
                    {children}
                </Text>
            )
        case 'bulleted-list':
            return (
                <UnorderedList align={element.align}>{children}</UnorderedList>
            )
        case 'heading-one':
            return (
                <Text fontSize="4xl" fontWeight="bold" align={element.align}>
                    {children}
                </Text>
            )
        case 'heading-two':
            return (
                <Text fontSize="2xl" fontWeight="bold" align={element.align}>
                    {children}
                </Text>
            )
        case 'list-item':
            return <ListItem align={element.align}>{children}</ListItem>
        case 'numbered-list':
            return <OrderedList align={element.align}>{children}</OrderedList>
        default:
            return <Text align={element.align}>{children}</Text>
    }
}

export const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

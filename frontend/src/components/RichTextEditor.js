import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBold,
    faItalic,
    faUnderline,
    faCode,
    faHeading,
    fa1,
    fa2,
    faQuoteLeft,
    faListOl,
    faList,
    faAlignJustify,
    faAlignCenter,
    faAlignRight,
    faAlignLeft,
} from '@fortawesome/free-solid-svg-icons'
import { HStack, Text, Container, Heading, Box } from '@chakra-ui/react'
import axios from 'axios'
import { Element, Leaf } from './RenderComment'
const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const EditorButton = React.forwardRef(
    ({ className, active, ...props }, ref) => {
        return (
            <Text
                as="span"
                {...props}
                ref={ref}
                color={active ? 'black' : '#ccc'}
            />
        )
    }
)

const RichTextEditor = (props) => {
    const { ticketType, ticketId, currentUser, allComments, setAllComments } =
        props
    const [value, setValue] = useState(initialValue)

    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    const createComment = async (comment) => {
        try {
            const newId = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/comments/newid`
            )
            const newComment = { _id: newId.data._id, ...comment }
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/comments`,
                newComment
            )
            setAllComments([...allComments, newComment])
            setValue(initialValue)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    return (
        // center the editor
        <Box border="2px solid #ccc" width="800px" p="4px">
            <Slate
                editor={editor}
                value={value}
                onChange={(value) => setValue(value)}
            >
                <Box mb="4px" p="8px" borderBottom="2px solid #757575">
                    {/* <div style={{backgroundColor: "green"}}> */}
                    <HStack spacing="16px" bgColor="gray.50">
                        <MarkButton
                            format="bold"
                            icon={<FontAwesomeIcon icon={faBold} />}
                        />
                        <MarkButton
                            format="italic"
                            icon={<FontAwesomeIcon icon={faItalic} />}
                        />
                        <MarkButton
                            format="underline"
                            icon={<FontAwesomeIcon icon={faUnderline} />}
                        />
                        <MarkButton
                            format="code"
                            icon={<FontAwesomeIcon icon={faCode} />}
                        />
                        <BlockButton
                            format="heading-one"
                            icon={
                                <Text as="span">
                                    <FontAwesomeIcon icon={faHeading} />
                                    <FontAwesomeIcon icon={fa1} />
                                </Text>
                            }
                        />
                        <BlockButton
                            format="heading-two"
                            icon={
                                <Text as="span">
                                    <FontAwesomeIcon icon={faHeading} />
                                    <FontAwesomeIcon icon={fa2} />
                                </Text>
                            }
                        />
                        <BlockButton
                            format="block-quote"
                            icon={<FontAwesomeIcon icon={faQuoteLeft} />}
                        />
                        <BlockButton
                            format="numbered-list"
                            icon={<FontAwesomeIcon icon={faListOl} />}
                        />
                        <BlockButton
                            format="bulleted-list"
                            icon={<FontAwesomeIcon icon={faList} />}
                        />
                        <BlockButton
                            format="left"
                            icon={<FontAwesomeIcon icon={faAlignLeft} />}
                        />
                        <BlockButton
                            format="center"
                            icon={<FontAwesomeIcon icon={faAlignCenter} />}
                        />
                        <BlockButton
                            format="right"
                            icon={<FontAwesomeIcon icon={faAlignRight} />}
                        />
                        <BlockButton
                            format="justify"
                            icon={<FontAwesomeIcon icon={faAlignJustify} />}
                        />
                    </HStack>
                    {/* </div> */}
                </Box>
                <Box p="6px" border="2px solid #ccc">
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Enter some rich text…"
                        style={{ width: '800px' }}
                        spellCheck
                        autoFocus
                        onKeyDown={(event) => {
                            for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, event)) {
                                    event.preventDefault()
                                    const mark = HOTKEYS[hotkey]
                                    toggleMark(editor, mark)
                                }
                            }
                        }}
                    />
                </Box>
            </Slate>
            <button
                onClick={() => {
                    createComment({
                        ticketType: ticketType,
                        ticketId: parseInt(ticketId),
                        commentBlob: JSON.stringify(value),
                        userEmail: currentUser.email,
                    })
                    setValue(initialValue)
                }}
            >
                Log
            </button>
        </Box>
    )
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })

    let newProperties = {}
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format, blockType = 'type') => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    )

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)

    return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <EditorButton
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            )}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <Text as="span">{icon}</Text>
        </EditorButton>
    )
}

const MarkButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <EditorButton
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Text as="span">{icon}</Text>
        </EditorButton>
    )
}

const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
]

export default RichTextEditor

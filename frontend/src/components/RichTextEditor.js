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
import { HStack, Text, Container } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
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

const createComment = async (comment) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/comments`,
            comment
        )
        return response
    } catch (error) {
        console.log(error)
    }
}

const RichTextExample = (props) => {
    const { ticketType, ticketId } = props
    const [value, setValue] = useState(initialValue)
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const { currentUser } = useAuth()
    console.log(currentUser)
    return (
        <Container border="2px solid #ccc" width="700px" p="4px">
            <Slate
                editor={editor}
                value={value}
                onChange={(value) => setValue(value)}
                style={{ background: 'blue' }}
            >
                <Container mb="4px" p="8px" borderBottom="2px solid #757575">
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
                            iicon={<FontAwesomeIcon icon={faAlignRight} />}
                        />
                        <BlockButton
                            format="justify"
                            icon={<FontAwesomeIcon icon={faAlignJustify} />}
                        />
                    </HStack>
                    {/* </div> */}
                </Container>
                <Container p="6px">
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Enter some rich text…"
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
                </Container>
            </Slate>
            <button
                onClick={() =>
                    createComment({
                        ticketType: ticketType,
                        ticketId: parseInt(ticketId),
                        commentBlob: JSON.stringify(editor),
                        userEmail: currentUser.email,
                    })
                }
            >
                Log
            </button>
        </Container>
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
    console.log(newProperties)
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

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

const Leaf = ({ attributes, children, leaf }) => {
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
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
                text: ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }],
    },
    {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }],
    },
]

export default RichTextExample

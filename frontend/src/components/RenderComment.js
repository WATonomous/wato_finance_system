import React from 'react'
import { Text, UnorderedList, OrderedList, ListItem } from '@chakra-ui/react'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'
import { useCallback, useMemo } from 'react'

export const CommentMessage = (props) => {
    const { comment } = props
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    return (
        <Slate value={comment} editor={editor}>
            <Editable
                readOnly={true}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                value={comment}
            />
        </Slate>
    )
}

export const Element = ({ children, element }) => {
    console.log(children)
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

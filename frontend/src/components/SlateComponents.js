import React from 'react'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import ReactDOM from 'react-dom'
import { cx, css } from '@emotion/css'
import { useSlate } from 'slate-react'

const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const toggleBlock = (editor, format) => {
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
    let newProperties
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

export const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

export const isBlockActive = (editor, format, blockType = 'type') => {
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

export const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <Button
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
            <Icon>{icon}</Icon>
        </Button>
    )
}

export const MarkButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

export const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote
                    style={{
                        textAlign: element.align,
                        borderLeft: '4px #d5dbe3 solid',
                        paddingLeft: '5px',
                        marginLeft: '5px',
                    }}
                    {...attributes}
                >
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

export const Button = React.forwardRef(
    ({ className, active, reversed, ...props }, ref) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: ${reversed
                        ? active
                            ? 'white'
                            : '#aaa'
                        : active
                        ? 'black'
                        : '#ccc'};
                `
            )}
        />
    )
)

export const EditorValue = React.forwardRef(
    ({ className, value, ...props }, ref) => {
        const textLines = value.document.nodes
            .map((node) => node.text)
            .toArray()
            .join('\n')
        return (
            <div
                ref={ref}
                {...props}
                className={cx(
                    className,
                    css`
                        margin: 30px -20px 0;
                    `
                )}
            >
                <div
                    className={css`
                        font-size: 14px;
                        padding: 5px 20px;
                        color: #404040;
                        border-top: 2px solid #eeeeee;
                        background: #f8f8f8;
                    `}
                >
                    Slate's value as text
                </div>
                <div
                    className={css`
                        color: #404040;
                        font: 12px monospace;
                        white-space: pre-wrap;
                        padding: 10px 20px;
                        div {
                            margin: 0 0 0.5em;
                        }
                    `}
                >
                    {textLines}
                </div>
            </div>
        )
    }
)

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
    <span
        {...props}
        ref={ref}
        className={cx(
            'material-icons',
            className,
            css`
                font-size: 18px;
                vertical-align: text-bottom;
            `
        )}
    />
))

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
    <div
        {...props}
        ref={ref}
        className={cx(
            className,
            css`
                white-space: pre-wrap;
                margin: 0 -20px 10px;
                padding: 10px 20px;
                font-size: 14px;
                background: #f8f8e8;
            `
        )}
    />
))

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
    <div
        {...props}
        data-test-id="menu"
        ref={ref}
        className={cx(
            className,
            css`
                & > * {
                    display: inline-block;
                }

                & > * + * {
                    margin-left: 15px;
                }
            `
        )}
    />
))

export const Portal = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
    <Menu
        {...props}
        ref={ref}
        className={cx(
            className,
            css`
                position: relative;
                padding: 1px 18px 0px;
                margin: 0 -20px;
            `
        )}
    />
))

import { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { useAuth } from '../contexts/AuthContext'
import { axiosPreset } from '../axiosConfig'
import { Box, Button } from '@chakra-ui/react'

import {
    BlockButton,
    Element,
    Leaf,
    MarkButton,
    Toolbar,
    toggleMark,
} from './SlateComponents'

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
}

const cleanInput = (val) => {
    const res = []
    let l = 0
    let r = val.length - 1
    while (l <= r) {
        if (val[l]['children'][0]['text'] == '') {
            l += 1
        }
        if (val[r]['children'][0]['text'] == '') {
            r += -1
        }

        if (
            val[l]['children'][0]['text'] != '' &&
            val[r]['children'][0]['text'] != ''
        ) {
            break
        }
    }
    for (let i = l; i <= r; i++) {
        res.push(val[i])
    }
    return res
}

const invalidInput = (val) => {
    if (val.length === 0) {
        return true
    }

    for (let i = 0; i < val.length; i++) {
        if (val[i]['children'][0]['text'] != '') {
            return false
        }
    }
    return true
}

const CommentInput = ({ code, getComments, reply, onClose, ticket }) => {
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [loading, setLoading] = useState(false)
    const auth = useAuth()
    const [val, setVal] = useState(editor.children)
    const handleSubmit = (ref, ticket) => {
        setLoading(true)
        const comment = cleanInput(val)
        if (comment.length === 0) {
            console.log('EMPTY')
            return
        }
        const payload = {
            author_id: auth.currentUser.uid,
            comment: comment,
            reference_code: ref,
        }
        axiosPreset
            .post('/comments', payload)
            .then(() => getComments(ticket).then(() => setLoading(false)))

            .catch(() => setLoading(false))
    }

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={() => {
                setVal([...editor.children])
            }}
        >
            <Editable
                style={{
                    marginTop: '10px',
                    padding: '20px',
                    paddingLeft: '30px',
                    minHeight: '150px',
                    border: '2px #f0f0f0 solid',
                    borderRadius: '10px',
                }}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                autoFocus={reply}
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
            <Box
                display="flex"
                width="100%"
                justifyContent="space-between"
                paddingLeft="5px"
            >
                <Toolbar>
                    <MarkButton format="bold" icon="format_bold" />
                    <MarkButton format="italic" icon="format_italic" />
                    <MarkButton format="underline" icon="format_underlined" />
                    <BlockButton format="block-quote" icon="format_quote" />
                    <BlockButton
                        format="numbered-list"
                        icon="format_list_numbered"
                    />
                    <BlockButton
                        format="bulleted-list"
                        icon="format_list_bulleted"
                    />
                </Toolbar>
                <Box
                    display="flex"
                    gap="10px"
                    marginTop="5px"
                    paddingRight="5px"
                >
                    {reply && (
                        <Button
                            onClick={onClose}
                            padding="10px"
                            height="32px"
                            colorScheme="red"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        isLoading={loading}
                        disabled={val.length === 0 || invalidInput(val)}
                        padding="10px"
                        height="32px"
                        colorScheme="blue"
                        onClick={() => {
                            handleSubmit(code, ticket)
                        }}
                    >
                        {reply ? 'Reply' : 'Comment'}
                    </Button>
                </Box>
            </Box>
        </Slate>
    )
}

// example taken from https://github.com/ianstormtaylor/slate/blob/main/site/components.tsx
// remove once dynamically fetched from backend
const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
]

export default CommentInput

//make a function that removes white lines in the start
//parses data to make it look nice

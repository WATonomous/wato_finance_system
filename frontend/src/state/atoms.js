import { atom } from 'recoil'

const allTicketsState = atom({
    key: 'allTickets',
    default: {},
})

const currentTreeState = atom({
    key: 'currentTree',
    default: {},
})

const currentFiles = atom({
    key: 'currentFiles',
    default: [],
})

export { allTicketsState, currentTreeState, currentFiles }

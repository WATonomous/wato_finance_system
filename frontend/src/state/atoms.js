import { atom } from 'recoil'
import { TICKET_TYPES } from '../constants'

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

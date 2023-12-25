import { atom } from 'recoil'
import { TICKET_TYPES } from '../constants'

const allTicketsState = atom({
    key: 'allTickets',
    default: {
        [TICKET_TYPES.SF]: [],
        [TICKET_TYPES.FI]: [],
        [TICKET_TYPES.PPR]: [],
        [TICKET_TYPES.UPR]: [],
    },
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

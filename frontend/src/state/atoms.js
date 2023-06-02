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

const currentTicketState = atom({
    key: 'currentTicket',
    default: {
        data: {},
        type: '',
        id: 0,
        code: '',
        codename: '',
    },
})

export { allTicketsState, currentTreeState, currentTicketState }

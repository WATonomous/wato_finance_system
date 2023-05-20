import { TICKET_TYPES } from '../constants'

const buildTicketTree = (currentTicket, allTickets) => {
    const { SF, FI, PPR, UPR } = allTickets
    if (!currentTicket || allTickets[currentTicket.type].length === 0) return {}

    // Special Case: WATO Cash
    if (currentTicket.data.sf_link === -1) {
        const WATOCashTicketID = parseInt(currentTicket.id)
        const personalPurchases = PPR.filter((ppr) => ppr.fi_link === WATOCashTicketID)
        const uwFinancePurchases = UPR.filter((upr) => upr.fi_link === WATOCashTicketID)
        return { ...currentTicket.data, personalPurchases, uwFinancePurchases }
    }

    const ticketID = parseInt(currentTicket.id)
    let sf_id = ticketID

    switch (currentTicket.type) {
        case TICKET_TYPES.FI:
            sf_id = FI.find((ticket) => ticket._id === ticketID).sf_link
            break
        case TICKET_TYPES.PPR:
            const ppr = PPR.find((ticket) => ticket._id === ticketID)
            sf_id = FI.find((ticket) => ticket._id === ppr.fi_link).sf_link
            break
        case TICKET_TYPES.UPR:
            const upr = UPR.find((ticket) => ticket._id === ticketID)
            sf_id = FI.find((ticket) => ticket._id === upr.fi_link).sf_link
            break
        default:
            break
    }

    const sponsorshipFund = SF.find((sf) => sf._id === sf_id)
    const FI_arr = FI.filter((fi) => fi.sf_link === sf_id)
    const allSFChildren = FI_arr.map((fi) => {
        const personalPurchases = PPR.filter((ppr) => ppr.fi_link === fi._id)
        const uwFinancePurchases = UPR.filter((upr) => upr.fi_link === fi._id)
        return { ...fi, personalPurchases, uwFinancePurchases }
    })
    return { ...sponsorshipFund, fundingItems: allSFChildren }
}

export default buildTicketTree

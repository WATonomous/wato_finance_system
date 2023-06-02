import { TICKET_TYPES } from '../constants'

const buildTicketTree = (currentTicket, allTickets) => {
    const { SF, FI, PPR, UPR } = allTickets
    if (!currentTicket || allTickets[currentTicket.type].length === 0) return {}

    let sf_id = currentTicket._id
    if (currentTicket.type === TICKET_TYPES.FI) {
        sf_id = currentTicket.sf_link
    } else if (
        currentTicket.type === TICKET_TYPES.UPR ||
        currentTicket.type === TICKET_TYPES.PPR
    ) {
        sf_id = FI.find(
            (ticket) => ticket._id === currentTicket.fi_link
        ).sf_link
    }

    // Special Case: WATO Cash
    // SF should never have id of -1
    if (sf_id === -1) {
        const WATOCashTicketID =
            currentTicket.type === TICKET_TYPES.FI
                ? currentTicket._id
                : currentTicket.fi_link
        const WATOCASHTicket = FI.find((fi) => fi._id === WATOCashTicketID)
        const personalPurchases = PPR.filter(
            (ppr) => ppr.fi_link === WATOCashTicketID
        )
        const uwFinancePurchases = UPR.filter(
            (upr) => upr.fi_link === WATOCashTicketID
        )
        return { ...WATOCASHTicket, personalPurchases, uwFinancePurchases }
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

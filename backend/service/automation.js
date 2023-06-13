// import { PersonalPurchaseApproved } from '../emails/emails'
// import { createEmail } from './createEmail'

// ticket of type personalPurchase or uwFinancePurchase
const transitionReadyToBuy = async (ticketType, ticketId) => {
    const ticket = ticketType.findByIdAndUpdate(ticketId, {
        status: 'READY_TO_BUY',
    })
    return ticket
}

module.exports = {
    transitionReadyToBuy,
}

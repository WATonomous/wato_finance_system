import { PersonalPurchaseApproved } from '../emails/emails'
import { createEmail } from './emails.controller'

// ticket of type personalPurchase or uwFinancePurchase
export const transitionReadyToBuy = async (ticketType, ticketId) => {
    const ticket = ticketType.findByIdAndUpdate(ticketId, {
        status: 'READY_TO_BUY',
    })
    // const payload = PersonalPurchaseApproved({
    //     ticket.

    // })
    // // send email
    // createEmail(
    //     {

    //     }
    // )
}

module.exports = {
    transitionReadyToBuy,
}

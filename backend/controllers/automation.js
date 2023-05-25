// ticket of type personalPurchase or uwFinancePurchase
export const transitionReadyToBuy = async (ticketType, id) => {
    ticketType.findByIdAndUpdate(id, {
        status: 'READY_TO_BUY',
    })
    // send email
}

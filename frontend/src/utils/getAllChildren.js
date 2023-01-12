const getAllChildren = (sf_id, allTickets) => {
    if (sf_id === -1 || allTickets['SF'].length === 0) return
    let { SF, FI, PPR, UPR } = allTickets

    const sponsorshipFund = SF.find((sf) => sf._id === sf_id)
    const FI_arr = FI.filter((fi) => fi.sf_link === sf_id)
    const allSFChildren = FI_arr.map((fi) => {
        const personalPurchases = PPR.filter((ppr) => ppr.fi_link === fi._id)
        const uwFinancePurchases = UPR.filter((upr) => upr.fi_link === fi._id)
        return { ...fi, personalPurchases, uwFinancePurchases }
    })
    return { ...sponsorshipFund, fundingItems: allSFChildren }
}

export default getAllChildren

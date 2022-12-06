const fetch = require('node-fetch')
const dummyData = require('./dummyData')

const endpoint = 'http://localhost:5000'
const generateDummyData = async () => {
    try {
        const sponsorshipFundIds = await createSponsorshipFunds()
        console.log('sponsorship funds created')
        const fundingItemIds = await createFundingItems(sponsorshipFundIds)
        console.log('funding item created')
        await createPersonalPurchases(fundingItemIds)
        console.log('personal purchases created')
        await createUWFinancePurchases(fundingItemIds)
        console.log('uw finance purchases created')
    } catch (err) {
        console.log('script failed: ')
        console.log(err)
    }
}

const createSponsorshipFunds = async () => {
    return Promise.all(
        dummyData.dummySponsorshipFunds.map(async (sponsorshipFund) => {
            const res = await fetch(`${endpoint}/sponsorshipfunds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sponsorshipFund),
            })
            const data = await res.json()
            return data._id
        })
    )
}

const createFundingItems = async (sf_ids) => {
    return Promise.all(
        dummyData.dummyFundingItems.map(async (fundingItem, i) => {
            fundingItem = {
                ...fundingItem,
                sf_link: sf_ids[i],
            }
            const res = await fetch(`${endpoint}/fundingitems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fundingItem),
            })
            const data = await res.json()
            console.log('Data', data)
            return data._id
        })
    )
}

const createPersonalPurchases = async (fi_ids) => {
    return Promise.all(
        dummyData.dummyPersonalPurchaseRequests.map(
            async (personalPurchase, i) => {
                personalPurchase = {
                    ...personalPurchase,
                    fi_link: fi_ids[i],
                }
                const res = await fetch(`${endpoint}/personalpurchases`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(personalPurchase),
                })
                const data = await res.json()
                return data._id
            }
        )
    )
}

const createUWFinancePurchases = async (fi_ids) => {
    return Promise.all(
        dummyData.dummyUWFinancePurchaseRequests.map(
            async (uwFinancePurchase, i) => {
                uwFinancePurchase = {
                    ...uwFinancePurchase,
                    fi_link: fi_ids[i],
                }
                const res = await fetch(`${endpoint}/uwfinancepurchases`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(uwFinancePurchase),
                })
                const data = await res.json()
                return data._id
            }
        )
    )
}

generateDummyData()

const { LoremIpsum } = require('lorem-ipsum')
const {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} = require('unique-names-generator')
const fetch = require('node-fetch')

const endpoint = 'http://localhost:5000'
const numSponsorhipFundsToCreate = 2
const numFundingItemsToCreatePerSponsorshipFund = 2
const numPersonalPurchasesToCreatePerFundingItem = 2
const numUWFinancePurchasesToCreatePerFundingItem = 2

const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
})

const generateRandomAmount = (max) => {
    const dollars = Math.floor(Math.random() * max)
    const cents = Math.floor(Math.random() * 100)
    return dollars + cents / 100
}

const getRandomNumberFromLength = (length) => {
    return Math.floor(
        Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    )
}

const generateDummyData = async () => {
    try {
        const sponsorshipFundIds = await createSponsorshipFunds()
        console.log('✅ sponsorship funds created')
        const fundingItemIds = await createFundingItems(sponsorshipFundIds)
        console.log('✅ funding item created')
        await createPersonalPurchases(fundingItemIds)
        console.log('✅ personal purchases created')
        await createUWFinancePurchases(fundingItemIds)
        console.log('✅ uw finance purchases created')
    } catch (err) {
        console.log('❌ script failed: ')
        console.log(err)
    }
}

const generateDummySF = () => {
    return {
        reporter_id: getRandomNumberFromLength(5),
        status: 'ALLOCATED',
        organization: 'WEEF',
        semester: 'Winter 2023',
        proposal_id: getRandomNumberFromLength(10),
        funding_allocation: generateRandomAmount(100),
        proposal_url: 'https://google.com',
        presentation_url: 'https://google.com',
        claim_deadline: '2024-12-25',
    }
}

const generateDummyPersonalPurchase = () => {
    return {
        reporter_id: getRandomNumberFromLength(5),
        status: 'SEEKING_APPROVAL',
        name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            length: 3,
            separator: '-',
        }),
        purchase_url: 'https://www.google.com/',
        purchase_instructions: lorem.generateSentences(1),
        cost: generateRandomAmount(20),
        purchase_justification: lorem.generateSentences(1),
        pickup_instruction: lorem.generateSentences(1),
        finance_team_approval: false,
        team_captain_approval: false,
        faculty_advisor_approval: false,
        requisition_number: getRandomNumberFromLength(10),
        po_number: getRandomNumberFromLength(8),
    }
}

const generateDummyUWFinancePurchaseRequest = () => {
    return {
        reporter_id: getRandomNumberFromLength(5),
        status: 'SEEKING_APPROVAL',
        name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            length: 3,
            separator: '-',
        }),
        purchase_url: 'https://www.google.com/',
        purchase_instructions: lorem.generateSentences(1),
        cost: generateRandomAmount(20),
        purchase_justification: lorem.generateSentences(1),
        pickup_instruction: lorem.generateSentences(1),
        finance_team_approval: false,
        team_captain_approval: false,
        faculty_advisor_approval: false,
        requisition_number: getRandomNumberFromLength(10),
        po_number: getRandomNumberFromLength(8),
    }
}

const generateDummyFundingItem = () => {
    return {
        name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            length: 3,
            separator: '-',
        }),
        funding_allocation: generateRandomAmount(30),
        purchase_justification: lorem.generateSentences(1),
    }
}
const createSponsorshipFunds = async () => {
    const sponsorshipFundsData = []
    for (let i = 0; i < numSponsorhipFundsToCreate; i++) {
        sponsorshipFundsData.push(generateDummySF())
    }
    return Promise.all(
        sponsorshipFundsData.map(async (sponsorshipFund) => {
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
    const fundingItemsData = []
    for (let i = 0; i < sf_ids.length; i++) {
        for (let j = 0; j < numFundingItemsToCreatePerSponsorshipFund; j++) {
            fundingItemsData.push({
                ...generateDummyFundingItem(),
                sf_link: sf_ids[i],
            })
        }
    }
    return Promise.all(
        fundingItemsData.map(async (fundingItem) => {
            const res = await fetch(`${endpoint}/fundingitems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fundingItem),
            })
            const data = await res.json()
            return data._id
        })
    )
}

const createPersonalPurchases = async (fi_ids) => {
    const personalPurchases = []
    for (let i = 0; i < fi_ids.length; i++) {
        for (let j = 0; j < numPersonalPurchasesToCreatePerFundingItem; j++) {
            personalPurchases.push({
                ...generateDummyPersonalPurchase(),
                fi_link: fi_ids[i],
            })
        }
    }
    return Promise.all(
        personalPurchases.map(async (personalPurchase) => {
            const res = await fetch(`${endpoint}/personalpurchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personalPurchase),
            })
            const data = await res.json()
            return data._id
        })
    )
}

const createUWFinancePurchases = async (fi_ids) => {
    const uwFinancePurchases = []
    for (let i = 0; i < fi_ids.length; i++) {
        for (let j = 0; j < numUWFinancePurchasesToCreatePerFundingItem; j++) {
            uwFinancePurchases.push({
                ...generateDummyUWFinancePurchaseRequest(),
                fi_link: fi_ids[i],
            })
        }
    }
    return Promise.all(
        uwFinancePurchases.map(async (uwFinancePurchase) => {
            const res = await fetch(`${endpoint}/uwfinancepurchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uwFinancePurchase),
            })
            const data = await res.json()
            return data._id
        })
    )
}

generateDummyData()

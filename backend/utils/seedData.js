const { LoremIpsum } = require('lorem-ipsum')
const {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} = require('unique-names-generator')
const fetch = require('node-fetch')
const admin = require('firebase-admin')
const fs = require('fs')
// ------------------- Seed Data -------------------
const yargs = require('yargs')
const argv = yargs.option('prod', {
    alias: 'p',
    describe: 'Set to true to only create necessary data for production',
    type: 'boolean',
}).argv
// ------------------- Seed Data -------------------

// ------------------- Auth Setup -------------------
if (!fs.existsSync('./serviceAccountKey.json')) {
    console.log('❌ No service account key provided. Exiting...')
    process.exit(1)
}
const serviceAccount = require('../serviceAccountKey.json')
require('dotenv').config()
if (!process.env.WATO_FINANCE_FIREBASE_API_KEY) {
    console.log('❌ No firebase api key provided. Exiting...')
    process.exit(1)
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
let headers
// ------------------- Auth Setup -------------------

const numSponsorhipFundsToCreate = 2
const minFundingAllocationForSponsorshipFunds = 1000
const numFundingItemsToCreatePerSponsorshipFund = 2
const numPersonalPurchasesToCreatePerFundingItem = 2
const numUWFinancePurchasesToCreatePerFundingItem = 2

const backend_url =
    process.env.WATO_FINANCE_BACKEND_URL || 'http://localhost:5000'

const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
})

const generateRandomAmount = (max, baseOffset = 0) => {
    const dollars = Math.floor(Math.random() * max)
    const cents = Math.floor(Math.random() * 100)
    return baseOffset + dollars + cents / 100
}

const getRandomNumberFromLength = (length) => {
    return Math.floor(
        Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    )
}

const generateDummyData = async () => {
    try {
        // cashfund must have a hardcoded id of 0, that is to uniquely identify it
        // as the cash fund even though it takes the shape of a funding item
        await createCashFund()
        console.log('✅ cash fund created')
        if (argv.prod) {
            // don't create dummy data for production
            console.log('🏃💨 Exiting early due to prod flag.')
            return
        }
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

const createCashFund = async () => {
    const cashFund = {
        name: 'WATO Cash',
        // sf_link and reporter_id are required, set to a dummy value
        // on the frontend, sf_link === -1 is an identifier for WATO Cash
        sf_link: -1,
        reporter_id: -1,
        funding_allocation: 0,
    }
    await fetch(`${backend_url}/fundingitems`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(cashFund),
    }).catch((err) => {
        console.log('❌ cash fund failed to create: ')
        console.log(err)
    })
}

const generateDummySF = () => {
    return {
        reporter_id: getRandomNumberFromLength(5),
        status: 'ALLOCATED',
        organization: 'WEEF',
        semester: 'Winter 2023',
        proposal_id: getRandomNumberFromLength(10),
        funding_allocation: generateRandomAmount(
            minFundingAllocationForSponsorshipFunds,
            minFundingAllocationForSponsorshipFunds
        ),
        proposal_url: 'https://google.com',
        presentation_url: 'https://google.com',
        claim_deadline: '2024-12-25',
    }
}

const generateDummyFundingItem = () => {
    const maxFundingAllocation =
        minFundingAllocationForSponsorshipFunds /
        numFundingItemsToCreatePerSponsorshipFund
    return {
        name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            length: 3,
            separator: '-',
        }),
        reporter_id: getRandomNumberFromLength(5),
        funding_allocation: generateRandomAmount(
            maxFundingAllocation / 2,
            maxFundingAllocation / 2
        ),
        purchase_justification: lorem.generateSentences(1),
    }
}

const generateDummyPersonalPurchase = () => {
    const maxCost =
        minFundingAllocationForSponsorshipFunds /
        (numFundingItemsToCreatePerSponsorshipFund *
            2 *
            (numPersonalPurchasesToCreatePerFundingItem +
                numUWFinancePurchasesToCreatePerFundingItem))
    return {
        reporter_id: getRandomNumberFromLength(5),
        status: 'SEEKING_APPROVAL',
        name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            length: 3,
            separator: '-',
        }),
        purchase_url: 'https://www.google.com/',
        cost: generateRandomAmount(maxCost / 2, maxCost / 2),
        purchase_justification: lorem.generateSentences(1),
        director_approval: false, // deprecated
        team_captain_approval: false, // deprecated
        admin_approval: false,
        faculty_advisor_approval: false,
    }
}

const generateDummyUWFinancePurchaseRequest = () => {
    const maxCost =
        minFundingAllocationForSponsorshipFunds /
        (numFundingItemsToCreatePerSponsorshipFund *
            2 *
            (numPersonalPurchasesToCreatePerFundingItem +
                numUWFinancePurchasesToCreatePerFundingItem))
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
        cost: generateRandomAmount(maxCost / 2, maxCost / 2),
        purchase_justification: lorem.generateSentences(1),
        pickup_instruction: lorem.generateSentences(1),
        director_approval: false, // deprecated
        team_captain_approval: false, // deprecated
        admin_approval: false,
        faculty_advisor_approval: false,
        requisition_number: getRandomNumberFromLength(10),
        po_number: getRandomNumberFromLength(8),
    }
}

const createSponsorshipFunds = async () => {
    const sponsorshipFundsData = []
    for (let i = 0; i < numSponsorhipFundsToCreate; i++) {
        sponsorshipFundsData.push(generateDummySF())
    }
    return Promise.all(
        sponsorshipFundsData.map(async (sponsorshipFund) => {
            const res = await fetch(`${backend_url}/sponsorshipfunds`, {
                method: 'POST',
                headers: headers,
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
            const res = await fetch(`${backend_url}/fundingitems`, {
                method: 'POST',
                headers: headers,
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
            const res = await fetch(`${backend_url}/personalpurchases`, {
                method: 'POST',
                headers: headers,
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
            const res = await fetch(`${backend_url}/uwfinancepurchases`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(uwFinancePurchase),
            })
            const data = await res.json()
            return data._id
        })
    )
}

const getIdToken = async () => {
    const token = await admin.auth().createCustomToken('seed-token')
    // fetch firebase api key
    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.WATO_FINANCE_FIREBASE_API_KEY}`,
        {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                returnSecureToken: true,
            }),
        }
    )
    const data = await res.json()
    return data.idToken
}

getIdToken().then((token) => {
    headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    }
    generateDummyData()
})

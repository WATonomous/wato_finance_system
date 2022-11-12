const mongoose = require('mongoose')

require('dotenv').config()

const SponsorshipFund = require('../models/sponsorshipfund.model')
const FundingItem = require('../models/fundingitem.model')
const UWFinancePurchase = require('../models/uwfinancepurchase.model')
const PersonalPurchaseRequest = require('../models/personalpurchase.model')

const dummyData = require('./dummyData')

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// that automatically creates (at least 2) sponsorship funds, with associated funding items, and associated uw finance purchases and personal purchases.

const connection = mongoose.connection

connection.once('open', () => {
    console.log('MongoDB database connection established successfully')

    SponsorshipFund.createCollection()
    FundingItem.createCollection()
    UWFinancePurchase.createCollection()
    PersonalPurchaseRequest.createCollection()

    const promise1 = SponsorshipFund.insertMany([dummyData.SF1, dummyData.SF2])
        .then(function () {
            console.log('Sponsorship Fund data generated')
        })
        .catch(function (error) {
            console.log(error)
        })

    const promise2 = FundingItem.insertMany([dummyData.FI1, dummyData.FI2])
        .then(function () {
            console.log('Funding data generated')
        })
        .catch(function (error) {
            console.log(error)
        })

    const promise3 = PersonalPurchaseRequest.insertMany([
        dummyData.PPR1,
        dummyData.PPR2,
    ])
        .then(function () {
            console.log('Personal Purchase data generated')
        })
        .catch(function (error) {
            console.log(error)
        })

    const promise4 = UWFinancePurchase.insertMany([
        dummyData.UPR1,
        dummyData.UPR2,
    ])
        .then(function () {
            console.log('UW Finance Purchase data generated')
        })
        .catch(function (error) {
            console.log(error)
        })

    Promise.all([promise1, promise2, promise3, promise4]).then(function () {
        connection.close(function () {
            console.log('MongoDB database connection closed')
        })
    })
})

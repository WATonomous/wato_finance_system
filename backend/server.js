const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = process.env.ATLAS_URI
console.log(uri)
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 1000 * 5,
    connectTimeoutMS: 1000 * 5,
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB database connection established successfully')
})

const usersRouter = require('./routes/users')
const fundingItemsRouter = require('./routes/FundingItems')
const emailRouter = require('./routes/Emails')
const sponsorshipFundsRouter = require('./routes/SponsorshipFunds')
const personalPurchaseRouter = require('./routes/PersonalPurchases')
const UWFinancePurchaseRouter = require('./routes/UWFinancePurchases')

app.use(express.json())

app.use('/users', usersRouter)
app.use('/fundingitems', fundingItemsRouter)
app.use('/personalpurchase', personalPurchaseRouter)
app.use('/emails', emailRouter)
app.use('/sponsorshipfunds', sponsorshipFundsRouter)
app.use('/uwfinancepurchases', UWFinancePurchaseRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

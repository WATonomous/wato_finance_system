const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 1000 * 20,
    connectTimeoutMS: 1000 * 20,
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB database connection established successfully')
})

const fundingItemsRouter = require('./routes/fundingitems.routes')
const emailRouter = require('./routes/emails.routes')
const sponsorshipFundsRouter = require('./routes/sponsorshipfunds.routes')
const personalPurchaseRouter = require('./routes/personalpurchases.routes')
const UWFinancePurchaseRouter = require('./routes/uwfinancepurchases.routes')
const usersRouter = require('./routes/users.routes')

app.use(express.json())

app.use('/fundingitems', fundingItemsRouter)
app.use('/personalpurchases', personalPurchaseRouter)
app.use('/emails', emailRouter)
app.use('/sponsorshipfunds', sponsorshipFundsRouter)
app.use('/uwfinancepurchases', UWFinancePurchaseRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

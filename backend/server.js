const { updateGroup } = require('./utils/getSheetData')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = process.env.WATO_FINANCE_PORT || 5000

app.use(cors())
app.use(express.json())

const uri = process.env.WATO_FINANCE_ATLAS_URI
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
const sponsorshipFundsRouter = require('./routes/sponsorshipfunds.routes')
const personalPurchaseRouter = require('./routes/personalpurchases.routes')
const UWFinancePurchaseRouter = require('./routes/uwfinancepurchases.routes')
const usersRouter = require('./routes/users.routes')
const groupRouter = require('./routes/googlegroup.routes')
const filesRouter = require('./routes/files.routes')
const commentRouter = require('./routes/comments.routes')

app.use(express.json())
app.use('/fundingitems', fundingItemsRouter)
app.use('/personalpurchases', personalPurchaseRouter)
app.use('/sponsorshipfunds', sponsorshipFundsRouter)
app.use('/uwfinancepurchases', UWFinancePurchaseRouter)
app.use('/users', usersRouter)
app.use('/googlegroups', groupRouter)
app.use('/files', filesRouter)
app.use('/comments', commentRouter)

app.listen(port, async () => {
    console.log(`Server is running on port: ${port}`)
    await updateGroup()
})

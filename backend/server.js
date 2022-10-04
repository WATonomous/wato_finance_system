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
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB database connection established successfully')
})

// const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users')
const fundingItemsRouter = require('./routes/fundingItems')
const personalPurchaseRouter = require('./routes/personalPurchase')
const emailRouter = require('./routes/email')

app.use(express.json())
// app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter)
app.use('/fundingitems', fundingItemsRouter)
app.use('/personalpurchase', personalPurchaseRouter)
app.use('/email', emailRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

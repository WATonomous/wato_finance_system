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
async function connectWithRetry(maxRetries = 5, initialDelay = 2000) {
    let attempts = 0;
    let delay = initialDelay;
    while (attempts < maxRetries) {
        try {
            await tryConnectMongo(uri);
            return;
        } catch (err) {
            attempts++;
            handleConnectionError(err, attempts, maxRetries, delay);
            await new Promise(res => setTimeout(res, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

async function tryConnectMongo(uri) {
    await mongoose.connect(uri, {
        socketTimeoutMS: 1000 * 20,
        connectTimeoutMS: 1000 * 20,
    });
    console.log('🛢️ MongoDB database connection established successfully');
}

function handleConnectionError(err, attempts, maxRetries, delay) {
    console.error(
        `❌ MongoDB connection failed (attempt ${attempts}/${maxRetries}), ` +
        `retrying in ${delay / 1000} seconds...`,
        err.message
    );
    if (attempts >= maxRetries) {
        console.error('❌ Maximum connection attempts reached. Exiting.');
        process.exit(1);
    }
}

const fundingItemsRouter = require('./routes/fundingitems.routes')
const sponsorshipFundsRouter = require('./routes/sponsorshipfunds.routes')
const personalPurchaseRouter = require('./routes/personalpurchases.routes')
const UWFinancePurchaseRouter = require('./routes/uwfinancepurchases.routes')
const usersRouter = require('./routes/users.routes')
const groupRouter = require('./routes/googlegroup.routes')
const filesRouter = require('./routes/files.routes')
const commentRouter = require('./routes/comments.routes')

app.use('/fundingitems', fundingItemsRouter)
app.use('/personalpurchases', personalPurchaseRouter)
app.use('/sponsorshipfunds', sponsorshipFundsRouter)
app.use('/uwfinancepurchases', UWFinancePurchaseRouter)
app.use('/users', usersRouter)
app.use('/googlegroups', groupRouter)
app.use('/files', filesRouter)
app.use('/comments', commentRouter)

await connectWithRetry();
app.listen(port, async () => {
    console.log(`🗄️  Server is running on port: ${port}`)
    await updateGroup()
})

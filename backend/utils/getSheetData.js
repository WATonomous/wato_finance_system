const Gsheet = require('google-spreadsheet')
require('dotenv').config()
const axios = require('axios')

// Config variables
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
const SHEET_ID = process.env.SHEET_ID
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.SERVICE_ACCOUNT_PRIVATE_KEY
const doc = new Gsheet.GoogleSpreadsheet(GOOGLE_SHEET_ID)

const EMAIL_HEADER_NAME = 'UW Email'
const WATIAM_HEADER_NAME = 'WATIAM ID'
const TITLE_HEADER_NAME = 'Title'

const readSpreadsheet = async () => {
    try {
        await doc.useServiceAccountAuth({
            client_email: SERVICE_ACCOUNT_EMAIL,
            private_key: SERVICE_ACCOUNT_PRIVATE_KEY,
        })
        // loads document properties and worksheets
        await doc.loadInfo()

        const sheet = doc.sheetsById[SHEET_ID]
        const rows = await sheet.getRows()

        return rows.map((row) => ({
            email: row[EMAIL_HEADER_NAME],
            watiam: row[WATIAM_HEADER_NAME],
            title: row[TITLE_HEADER_NAME],
        }))
    } catch (e) {
        console.error('Error: ', e)
    }
}

const updateGroup = async () => {
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/group/update`
    const pairs = await readSpreadsheet()
    try {
        await axios.post(endpoint, pairs)
        console.log('Updated google groups')
    } catch (err) {
        console.error(err)
    }
}

module.exports = { updateGroup }

const Gsheet = require('google-spreadsheet')
require('dotenv').config()
const axios = require('axios')

// Config variables
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
const SHEET_ID = process.env.SHEET_ID
const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const PRIVATE_KEY = process.env.PRIVATE_KEY

const doc = new Gsheet.GoogleSpreadsheet(GOOGLE_SHEET_ID)

const readSpreadsheet = async () => {
    try {
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        })
        // loads document properties and worksheets
        await doc.loadInfo()

        const sheet = doc.sheetsById[SHEET_ID]
        const rows = await sheet.getRows()

        const pairs = []

        rows.forEach((row) => {
            pairs.push({
                email: row['Email'],
                title: row['Title'],
            })
        })
        return pairs
    } catch (e) {
        console.error('Error: ', e)
    }
}

const updateGroup = async () => {
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/group/update`
    const newPairs = await readSpreadsheet()
    try {
        await axios.post(endpoint, newPairs)
        console.log('Updated google groups')
    } catch (err) {
        console.error(err)
    }
}

module.exports = { updateGroup }

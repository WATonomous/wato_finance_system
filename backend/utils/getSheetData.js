const Gsheet = require('google-spreadsheet')
require('dotenv').config()
const { updateGoogleGroups } = require('../service/googlegroup.service')

// Config variables
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
const SHEET_TAB_ID = process.env.SHEET_TAB_ID
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.SERVICE_ACCOUNT_PRIVATE_KEY
const doc = new Gsheet.GoogleSpreadsheet(GOOGLE_SHEET_ID)

const SCHOOL_EMAIL_HEADER = 'Email'
const TITLE_HEADER = 'Title'

const readSpreadsheet = async () => {
    try {
        await doc.useServiceAccountAuth({
            client_email: SERVICE_ACCOUNT_EMAIL,
            private_key: SERVICE_ACCOUNT_PRIVATE_KEY,
        })
        // loads document properties and worksheets
        await doc.loadInfo()

        const sheet = doc.sheetsById[SHEET_TAB_ID]
        const rows = await sheet.getRows()

        return rows.map((row) => ({
            email: row[SCHOOL_EMAIL_HEADER],
            title: row[TITLE_HEADER],
        }))
    } catch (e) {
        console.error('Error: ', e)
    }
}

const updateGroup = async () => {
    const userRows = await readSpreadsheet()
    try {
        // only write if there was an associated title with the user. there should be one for everyone.
        const cleanedUserRows = userRows.filter((userRow) => userRow.title)
        await updateGoogleGroups(cleanedUserRows)
        console.log('Updated google groups')
    } catch (err) {
        console.error(err)
    }
}

module.exports = { updateGroup }

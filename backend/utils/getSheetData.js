const fs = require('fs')
const yaml = require('js-yaml')
require('dotenv').config()

const { updateGoogleGroups } = require('../service/googlegroup.service')

const readUserGroups = async () => {
    // check if ./data exists
    if (!fs.existsSync('./data')) {
        console.log('No user role data to be found.')
        return []
    }
    const yamlFiles = await fs.promises.readdir('./data')
    const userGroups = []
    const promises = yamlFiles.map(async (yamlFile) => {
        const doc = yaml.load(
            await fs.promises.readFile(`./data/${yamlFile}`, 'utf8')
        )
        if (doc?.finance_system?.enabled) {
            userGroups.push(doc.finance_system)
        }
    })
    await Promise.all(promises)
    return userGroups
}

const updateGroup = async () => {
    const users = await readUserGroups()
    try {
        await updateGoogleGroups(users)
        console.log('Updated google groups')
    } catch (err) {
        console.error(err)
    }
}

module.exports = { updateGroup }

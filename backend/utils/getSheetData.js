const fs = require('fs/promises')
const yaml = require('js-yaml')
require('dotenv').config()

const { updateGoogleGroups } = require('../service/googlegroup.service')

const readUserGroups = async () => {
    const yamlFiles = await fs.readdir('./data')
    const userGroups = []
    const promises = yamlFiles.map(async (yamlFile) => {
        const doc = yaml.load(await fs.readFile(`./data/${yamlFile}`, 'utf8'))
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

const fs = require('fs')

const { updateGoogleGroups } = require('../service/googlegroup.service')

const readUserGroupsv2 = async () => {
    if (!fs.existsSync('./user_directory.json')) {
        return []
    }
    const data = JSON.parse(
        await fs.promises.readFile('./user_directory.json', 'utf8')
    )
    const userGroups = []
    for (const userInfo of data) {
        if (userInfo.finance_system?.enabled) {
            userGroups.push(userInfo.finance_system)
        }
    }
    return userGroups
}

const updateGroup = async () => {
    const users = await readUserGroupsv2()
    try {
        await updateGoogleGroups(users)
        console.log('✅ Finished updating user groups in db successfully')
    } catch (err) {
        console.error(err)
    }
}

module.exports = { updateGroup }

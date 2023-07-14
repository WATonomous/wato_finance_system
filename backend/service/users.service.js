const { authAdmin } = require('../auth/auth')
const getAllUsers = () => {
    //Default retrieves 1000 users
    return authAdmin.listUsers()
}

const getUserByUID = (uid) => {
    return authAdmin.getUser(uid)
}

const getReporterHTMLByUID = async (reporter_id) => {
    const userRecord = await authAdmin.getUser(reporter_id)
    return `${userRecord.displayName} \<${userRecord.email}\>`
}

module.exports = {
    getAllUsers,
    getUserByUID,
    getReporterHTMLByUID,
}

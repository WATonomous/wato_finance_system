const { authAdmin } = require('../auth/auth')
const getAllUsers = () => {
    //Default retrieves 1000 users
    return authAdmin.listUsers()
}

const getUserByUID = (uid) => {
    return authAdmin.getUser(uid)
}

module.exports = {
    getAllUsers,
    getUserByUID,
}

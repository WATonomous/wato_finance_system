const { authAdmin } = require('../auth/auth')
const getAllUsers = () => {
    //Default retrieves 1000 users
    return authAdmin.listUsers()
}

module.exports = {
    getAllUsers,
}

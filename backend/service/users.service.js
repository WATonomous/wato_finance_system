const { authAdmin } = require('../auth/auth')
const getAllUsers = () => {
    //Default retrieves 1000 users
    return authAdmin.listUsers()
}

const getUserByUID = async (uid) => {
    try {
        const user = await authAdmin.getUser(uid)
        return user
    } catch (err) {
        console.log(`❌ Failed to get user with uid: ${uid}`)
        console.log(err)
        return {
            email: null,
            displayName: 'No Reporter',
        }
    }
}

module.exports = {
    getAllUsers,
    getUserByUID,
}

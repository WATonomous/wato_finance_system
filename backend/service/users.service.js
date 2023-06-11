const admin = require('firebase-admin')
// import service account file (helps to know the firebase project details)
const serviceAccount = require('../serviceAccountKey.json')

// Intialize the firebase-admin project/account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const auth = admin.auth()

const getAllUsers = () => {
    //Default retrieves 1000 users
    return auth.listUsers()
}

module.exports = {
    getAllUsers,
}

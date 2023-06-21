const admin = require('firebase-admin')
// import service account file (helps to know the firebase project details)
const serviceAccount = require('../serviceAccountKey.json')

// Intialize the firebase-admin project/account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const authAdmin = admin.auth()

module.exports = {
    authAdmin,
}

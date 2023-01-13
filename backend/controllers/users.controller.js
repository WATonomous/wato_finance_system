const functions = require('firebase-functions')
const admin = require('firebase-admin')
// import service account file (helps to know the firebase project details)
const serviceAccount = require('../serviceAccountKey.json')

// Intialize the firebase-admin project/account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const auth = admin.auth()

const getAllUsers = (_, res) => {
    //Default retrieves 1000 users
    auth.listUsers()
        .then((userRecords) => {
            res.status(200).json(userRecords.users)
        })
        .catch((error) => console.log(error))
}

module.exports = {
    getAllUsers: functions.https.onRequest(getAllUsers),
}

const { getAuthRoles } = require('../controller/getAuthRoles')
const { authAdmin } = require('./auth')

const authenticateUser = async (req, res, next) => {
    const bearerToken = req.headers.authorization?.split(' ')
    if (!bearerToken || bearerToken.length !== 2) {
        return res.status(401).json({ error: `No user token provided` })
    }
    const token = bearerToken[1]
    try {
        const decodedToken = await authAdmin.verifyIdToken(token)
        req.user = decodedToken
        const roles = await getAuthRoles(
            decodedToken.uid,
            decodedToken.email,
            req?.body?.reporter_id
        )
        console.log(roles)
        next()
    } catch (err) {
        console.log('hit here')
        console.log(err)
        res.status(401).json({ error: `Invalid user token: ${err}` })
        return
    }
}

module.exports = {
    authenticateUser,
}

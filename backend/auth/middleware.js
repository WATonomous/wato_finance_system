const { authAdmin } = require('./auth')

const validateUser = (req, res, next) => {
    const bearerToken = req.headers.authorization?.split(' ')
    if (!bearerToken || bearerToken.length !== 2) {
        return res.status(401).json({ error: `No user token provided` })
    }
    const token = bearerToken[1]
    authAdmin
        .verifyIdToken(token)
        .then((decodedToken) => {
            // in the future will amend request to contain user details from decoded token
            next()
        })
        .catch((err) => {
            return res.status(401).json({ error: `Invalid user token: ${err}` })
        })
}

module.exports = {
    validateUser,
}

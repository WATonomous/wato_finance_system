const { getAuthRoles } = require('../controller/getAuthRoles')
const { TICKET_ENDPOINTS } = require('../models/constants')
const { getFundingItem } = require('../service/fundingitems.service')
const { getPersonalPurchase } = require('../service/personalpurchases.service')
const { getSponsorshipFund } = require('../service/sponsorshipfunds.service')
const {
    getUWFinancePurchase,
} = require('../service/uwfinancepurchases.service')
const { authAdmin } = require('./auth')

const authenticateUser = async (req, res, next) => {
    const bearerToken = req.headers.authorization?.split(' ')
    if (!bearerToken || bearerToken.length !== 2) {
        res.status(401).send({ error: `No user token provided` })
        return
    }
    const token = bearerToken[1]
    try {
        const decodedToken = await authAdmin.verifyIdToken(token)
        req.user = decodedToken
        // look for the id path variable
        // if it exists, check if the user is the reporter
        // otherwise, just assume false (the endpoint will not check for reporter)
        let reporter_id = null
        const itemId = req.params?.id
        if (itemId) {
            const baseUrl = req.baseUrl
            switch (baseUrl) {
                case TICKET_ENDPOINTS.UPR:
                    reporter_id = (await getUWFinancePurchase(itemId))
                        .reporter_id
                    break
                case TICKET_ENDPOINTS.FI:
                    reporter_id = (await getFundingItem(itemId)).reporter_id
                    break
                case TICKET_ENDPOINTS.SF:
                    reporter_id = (await getSponsorshipFund(itemId)).reporter_id
                    break
                case TICKET_ENDPOINTS.PP:
                    reporter_id = (await getPersonalPurchase(itemId))
                        .reporter_id
                    break
                default:
                    break
            }
        }

        // special case for seed token, we don't have a user id attached to it
        if (decodedToken.uid === 'seed-token') {
            next()
            return
        }
        const { isAdmin, isReporter } = await getAuthRoles(
            decodedToken.uid,
            decodedToken.email,
            reporter_id
        )
        req.user.isAdmin = isAdmin
        req.user.isReporter = isReporter
        next()
    } catch (err) {
        res.status(401).send({ error: `Invalid user token: ${err}` })
        return
    }
}

module.exports = {
    authenticateUser,
}

const { getGoogleGroup } = require('../service/googlegroup.service')
const { AUTH_ROLES } = require('../models/constants')

const getWATIAMFromEmail = async (email) => {
    return email.substring(0, email.indexOf('@'))
}

const getAuthRoles = async (user_uid, email, reporter_id) => {
    const watiam = await getWATIAMFromEmail(email)
    const currentGoogleGroup = await getGoogleGroup(watiam)
    const isAdmin = currentGoogleGroup?.title === AUTH_ROLES.Administrator
    const isReporter = reporter_id === user_uid

    return {
        isAdmin,
        isReporter,
    }
}

module.exports = {
    getAuthRoles,
}

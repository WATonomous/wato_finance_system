const { getGoogleGroup } = require('../service/googlegroup.service')
const {
    ADMIN_IDENTIFIERS,
    TEAM_CAPTAIN_TITLES,
    DIRECTOR_TITLES,
} = require('../models/constants')

const getWATIAMFromEmail = async (email) => {
    return email.substring(0, email.indexOf('@'))
}

const getAuthRoles = async (user_uid, email, reporter_id) => {
    const watiam = await getWATIAMFromEmail(email)
    const currentGoogleGroup = await getGoogleGroup(watiam)

    let isAdmin, isTeamCaptain, isDirector, isReporter

    if (process.env?.AUTH_OVERRIDE) {
        const authRoles = process.env?.AUTH_OVERRIDE?.split(',')
        isAdmin = authRoles.includes('ADMIN')
        isTeamCaptain = authRoles.includes('TEAM_CAPTAIN') || isAdmin
        isDirector = authRoles.includes('DIRECTOR') || isTeamCaptain
        isReporter = authRoles.includes('REPORTER')
    } else {
        isAdmin = ADMIN_IDENTIFIERS.includes(watiam)
        isTeamCaptain =
            isAdmin || TEAM_CAPTAIN_TITLES.includes(currentGoogleGroup.title)
        isDirector =
            isTeamCaptain || DIRECTOR_TITLES.includes(currentGoogleGroup.title)
        isReporter = reporter_id === user_uid
    }

    return {
        isAdmin,
        isTeamCaptain,
        isDirector,
        isReporter,
    }
}

module.exports = {
    getAuthRoles,
}

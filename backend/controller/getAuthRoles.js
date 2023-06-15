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
        isAdmin = process.env.AUTH_OVERRIDE === 'ADMIN'
        isTeamCaptain = process.env.AUTH_OVERRIDE === 'TEAM_CAPTAIN' || isAdmin
        isDirector = process.env.AUTH_OVERRIDE === 'DIRECTOR' || isTeamCaptain
        isReporter = process.env.AUTH_OVERRIDE === 'REPORTER'
    } else {
        isAdmin = ADMIN_IDENTIFIERS.includes(email)
        isTeamCaptain =
            isAdmin || TEAM_CAPTAIN_TITLES.includes(currentGoogleGroup.title)
        isDirector =
            isTeamCaptain || DIRECTOR_TITLES.includes(currentGoogleGroup.title)
        isReporter = reporter_id === user_uid
        console.log(reporter_id)
        console.log(isAdmin, isTeamCaptain, isDirector, isReporter)
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

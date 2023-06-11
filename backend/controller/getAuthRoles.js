const { getGoogleGroup } = require('../service/googlegroup.service')

const getAuthRoles = async (identifier) => {
    const currentGoogleGroup = await getGoogleGroup(identifier)

    let isAdmin, isTeamCaptain, isDirector

    if (process.env?.AUTH_OVERRIDE) {
        _isAdmin = process.env.AUTH_OVERRIDE === 'ADMIN'
        _isTeamCaptain =
            process.env.AUTH_OVERRIDE === 'TEAM_CAPTAIN' || _isAdmin
        _isDirector = process.env.AUTH_OVERRIDE === 'DIRECTOR' || _isTeamCaptain
    } else {
        isAdmin = ADMIN_IDENTIFIERS.includes(identifier)
        isTeamCaptain =
            isAdmin || TEAM_CAPTAIN_TITLES.includes(currentGoogleGroup.title)
        isDirector =
            isTeamCaptain || DIRECTOR_TITLES.includes(currentGoogleGroup.title)
    }

    return {
        isAdmin,
        isTeamCaptain,
        isDirector,
    }
}

module.exports = {
    getAuthRoles,
}

const { getGoogleGroup } = require('./googlegroup.controller')

export const getAuthRoles = async (identifier) => {
    const currentGoogleGroup = await getGoogleGroup(identifier)

    const isAdmin = FACULTY_ADVISOR_EMAILS.includes(identifier)
    const isTeamCaptain =
        isAdmin || TEAM_CAPTAIN_TITLES.includes(currentGoogleGroup.title)
    const isDirector =
        isTeamCaptain || DIRECTOR_TITLES.includes(currentGoogleGroup.title)

    return {
        isAdmin,
        isTeamCaptain,
        isDirector,
    }
}

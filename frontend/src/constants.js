export const TICKET_TYPES = Object.freeze({
    SF: 'SF',
    FI: 'FI',
    PPR: 'PPR',
    UPR: 'UPR',
})

export const TICKET_ENDPOINTS = Object.freeze({
    SF: '/sponsorshipfunds',
    FI: '/fundingitems',
    PPR: '/personalpurchases',
    UPR: '/uwfinancepurchases',
})

export const APPROVAL_LEVELS = Object.freeze({
    director_approval: 'director_approval',
    team_captain_approval: 'team_captain_approval',
    faculty_advisor_approval: 'faculty_advisor_approval',
})

export const FACULTY_ADVISOR_EMAILS = ['drayside@uwaterloo.ca']
export const TEAM_CAPTAIN_TITLES = ['Team Captain']
export const DIRECTOR_TITLES = ['Admin', 'Director']

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
    director_approval: 'director_approval', // deprecated
    team_captain_approval: 'team_captain_approval', // deprecated
    admin_approval: 'admin_approval',
    faculty_advisor_approval: 'faculty_advisor_approval',
})

export const AUTH_ROLES = Object.freeze({
    Member: 'Member',
    Administrator: 'Administrator',
})

export const ADMIN_IDENTIFIERS = ['drayside', 'v2zheng', 'jw4he', 'william.li']

export const ENDOWMENT_FUNDS = ['MEF', 'WEEF', 'EngSoc', 'Dean of Eng']

export const SEEKING_APPROVAL_STATUS = 'SEEKING_APPROVAL'

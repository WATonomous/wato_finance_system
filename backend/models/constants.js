// SF = sponsorship fund
// FI = funding item
// PPR = personal purchase request
// UPR = UW finance purchase request
const ENDOWMENT_FUNDS = ['MEF', 'WEEF', 'EngSoc', 'Dean of Eng']
const SF_STATUS = ['ALLOCATED', 'CLAIM_SUBMITTED', 'REIMBURSED']
const PPR_STATUS = [
    'SEEKING_APPROVAL',
    'READY_TO_BUY',
    'PURCHASED_AND_RECEIPTS_SUBMITTED',
    'REPORTER_PAID',
    'REPORTER_REIMBURSE_CONFIRMED',
]
const PPR_STATUS_FUNDING_SPENT = [
    'PURCHASED_AND_RECEIPTS_SUBMITTED',
    'REPORTER_PAID',
    'REPORTER_REIMBURSE_CONFIRMED',
]
const UPR_STATUS = [
    'SEEKING_APPROVAL',
    'SENT_TO_COORDINATOR',
    'ORDERED',
    'READY_FOR_PICKUP',
    'PICKED_UP',
]
const UPR_STATUS_FUNDING_SPENT = ['ORDERED', 'READY_FOR_PICKUP', 'PICKED_UP']

const APPROVAL_LEVELS = Object.freeze({
    director_approval: 'director_approval', // deprecated
    team_captain_approval: 'team_captain_approval', // deprecated
    admin_approval: 'admin_approval',
    faculty_advisor_approval: 'faculty_advisor_approval',
})

const AUTH_ROLES = Object.freeze({
    Member: 'Member',
    Administrator: 'Administrator',
})

const EMAIL_RECIPIENTS = Object.freeze({
    admin: 'admin',
    coordinator: 'coordinator',
    director: 'director',
    faculty_advisor: 'faculty_advisor',
    finance: 'finance',
    reporter: 'reporter',
    team_captain: 'team_captain',
    general: 'hello',
})

const TICKET_ENDPOINTS = Object.freeze({
    SF: '/sponsorshipfunds',
    FI: '/fundingitems',
    PPR: '/personalpurchases',
    UPR: '/uwfinancepurchases',
})

const ADMIN_IDENTIFIERS = ['drayside', 'v2zheng', 'jw4he', 'william.li']
const ADMIN_GROUP_EMAIL = 'finance-admin@watonomous.ca'
const GENERAL_CONTACT_EMAIL = 'hello@watonomous.ca'

module.exports = {
    ENDOWMENT_FUNDS,
    SF_STATUS,
    PPR_STATUS,
    PPR_STATUS_FUNDING_SPENT,
    UPR_STATUS,
    UPR_STATUS_FUNDING_SPENT,
    TICKET_ENDPOINTS,
    APPROVAL_LEVELS,
    AUTH_ROLES,
    EMAIL_RECIPIENTS,
    ADMIN_IDENTIFIERS,
    ADMIN_GROUP_EMAIL,
    GENERAL_CONTACT_EMAIL,
}

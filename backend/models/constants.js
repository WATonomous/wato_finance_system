// SF = sponsorship fund
// FI = funding item
// PPR = personal purchase request
// UPR = UW finance purchase request
const ENDOWMENT_FUNDS = ['MEF', 'WEEF', 'ENGSOC', 'DEAN_OF_ENG']
const SF_STATUS = ['ALLOCATED', 'CLAIM_SUBMITTED', 'REIMBURSED']
const PPR_STATUS = [
    'SEEKING_APPROVAL',
    'READY_TO_BUY',
    'PURCHASED_AND_RECEIPTS_SUBMITTED',
    'REPORTER_REIMBURSE_CONFIRMED',
    'SUBMITTED_FOR_REIMBURSEMENT',
    'REIMBURSED',
]
const PPR_STATUS_FUNDING_SPENT = [
    'PURCHASED_AND_RECEIPTS_SUBMITTED',
    'REPORTER_REIMBURSE_CONFIRMED',
    'SUBMITTED_FOR_REIMBURSEMENT',
    'REIMBURSED',
]
const UPR_STATUS = [
    'SEEKING_APPROVAL',
    'SENT_TO_COORDINATOR',
    'ORDERED',
    'PICKED_UP',
    'SUBMITTED_FOR_REIMBURSEMENT',
    'REIMBURSED',
]
const UPR_STATUS_FUNDING_SPENT = [
    'ORDERED',
    'PICKED_UP',
    'SUBMITTED_FOR_REIMBURSEMENT',
    'REIMBURSED',
]

const APPROVAL_LEVELS = Object.freeze({
    director_approval: 'director_approval',
    team_captain_approval: 'team_captain_approval',
    admin_approval: 'ADMIN_approval',
})

const ADMIN_EMAILS = ['drayside@uwaterloo.ca']
const TEAM_CAPTAIN_TITLES = ['Team Captain']
const DIRECTOR_TITLES = ['Admin', 'Director']

module.exports = {
    ENDOWMENT_FUNDS,
    SF_STATUS,
    PPR_STATUS,
    PPR_STATUS_FUNDING_SPENT,
    UPR_STATUS,
    UPR_STATUS_FUNDING_SPENT,
    APPROVAL_LEVELS,
    ADMIN_EMAILS,
    TEAM_CAPTAIN_TITLES,
    DIRECTOR_TITLES,
}

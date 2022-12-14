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
    'REPORTER_PAID',
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

module.exports = { ENDOWMENT_FUNDS, SF_STATUS, PPR_STATUS, UPR_STATUS }

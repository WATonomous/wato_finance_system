import React from 'react'
import axios from 'axios'
const emailTemplates = require('./EmailTemplates.js')

const {
    ExpiringFundingReminder,
    PurchaseRequestCreated,
    PurchaseRequestInvalidated,
    PersonalPurchaseApproved,
    UWFinancePurchaseApproved,
    NewApprovedPurchaseRequest,
    PurchaseRequestOrdered,
    PurchaseRequestArrived,
    SubmitReimbursementClaimToSponsorshipFund,
    ReimburseReporter,
    PaidPersonalPurchaseReimbursementClaimInstructions,
} = emailTemplates

const sendEmail = (email) => {
    axios
        .post('http://localhost:5000/emails', email)
        .then((res) => console.log(res.data))
}
const CreateEmail = () => {
    return <div></div>
}

export default CreateEmail

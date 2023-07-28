const { EMAIL_RECIPIENTS } = require('../models/constants')
const { sendEmail } = require('../service/sendEmail')
const { getUserByUID } = require('../service/users.service')

const DivisionEmails = {
    software: 'software-leads@watonomous.ca',
    mechanical: 'mechanical-leads@watonomous.ca',
    business: 'business-leads@watonomous.ca',
    electrical: 'electrical-leads@watonomous.ca',
}

const currencyFormatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
})

const getEmailToSection = async (reporter_id, recipients) => {
    const emailToSet = new Set(['jw4he@watonomous.ca'])

    if (recipients.includes(EMAIL_RECIPIENTS.admin)) {
        // TODO: use ADMIN_IDENTIFIERS (rename to ADMIN_EMAILS) after migrating to new onboarding data
    }

    if (recipients.includes(EMAIL_RECIPIENTS.coordinator)) {
        // TODO: determine which is the correct coordinator email
        // emailToSet.add('studentdesigncentreengineering@uwaterloo.ca')
        // emailToSet.add('srfeeney@uwaterloo.ca')
    }

    if (recipients.includes(EMAIL_RECIPIENTS.director)) {
        // TODO: get director emails
    }

    if (recipients.includes(EMAIL_RECIPIENTS.faculty_advisor)) {
        // emailToSet.add('drayside@uwaterloo.ca')
    }

    if (recipients.includes(EMAIL_RECIPIENTS.finance)) {
        // emailToSet.add(process.env.FINANCE_EMAIL)
    }

    if (recipients.includes(EMAIL_RECIPIENTS.reporter)) {
        const reporter = await getUserByUID(reporter_id)
        emailToSet.add(reporter.email)
    }

    if (recipients.includes(EMAIL_RECIPIENTS.team_captain)) {
        // TODO: get team captain emails
    }

    return [...emailToSet].map((Email) => ({ Email }))
}

const getMainMessageHTML = (msg) => `<p>${msg}</p>`

const getPPRTicketInfoHTML = async (ppr) => {
    const reporter = await getUserByUID(ppr.reporter_id)
    return `
        <p>
            Ticket Code: ${ppr.code} <br />
            Ticket Name: ${ppr.name} <br />
            Cost: CAD ${currencyFormatter.format(ppr.cost)} <br />
            Purchase URL: ${ppr.purchase_url} <br />
            Purchase Justification: ${ppr.purchase_justification} <br />
            Status: ${ppr.status} <br />
            Reporter: ${reporter.displayName} &lt;${reporter.email}&gt; <br />
            Created: ${new Date(ppr.createdAt).toDateString()}
        </p>
    `
}

const getUPRTicketInfoHTML = async (upr) => {
    const reporter = await getUserByUID(upr.reporter_id)
    return `
        <p>
            Ticket Code: ${upr.code} <br />
            Ticket Name: ${upr.name} <br />
            Cost: CAD ${currencyFormatter.format(upr.cost)} <br />
            Purchase URL: ${upr.purchase_url} <br />
            Purchase Instructions: ${upr.purchase_instructions} <br />
            Purchase Justification: ${upr.purchase_justification} <br />
            Status: ${upr.status} <br />
            Reporter: ${reporter.displayName} &lt;${reporter.email}&gt; <br />
            Created: ${new Date(upr.createdAt).toDateString()}
        </p>
    `
}

const getTicketLinkHTML = (ticketPath) => `
    <p>
        View the ticket here: 
        <a
            href=${process.env.CLIENT_URL}${ticketPath}
        >
            ${process.env.CLIENT_URL}${ticketPath}
        </a>
    </p>
`

const sendEmailPPRCreatedToApprovers = async (ppr) => {
    const Subject = `[Seeking Approval] ${ppr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            'A new Personal Purchase Request needs your approval!'
        ) +
        (await getPPRTicketInfoHTML(ppr)) +
        getTicketLinkHTML(ppr.path)
    const To = await getEmailToSection(ppr.reporter_id, [
        EMAIL_RECIPIENTS.faculty_advisor,
        EMAIL_RECIPIENTS.team_captain,
        EMAIL_RECIPIENTS.director,
    ])

    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailUPRCreatedToApprovers = async (upr) => {
    const Subject = `[Seeking Approval] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            'A new UW Finance Purchase Request needs your approval!'
        ) +
        (await getUPRTicketInfoHTML(upr)) +
        getTicketLinkHTML(upr.path)
    const To = await getEmailToSection(upr.reporter_id, [
        EMAIL_RECIPIENTS.faculty_advisor,
        EMAIL_RECIPIENTS.team_captain,
        EMAIL_RECIPIENTS.director,
    ])

    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailPPRApprovedToReporter = async (ppr) => {
    const Subject = `[Ready to Buy] ${ppr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Your Personal Purchase Request has been approved! Please purchase the approved item(s).<br>
            Upload your proof of purchase at the ticket link below to request reimbursement.`
        ) +
        (await getPPRTicketInfoHTML(ppr)) +
        getTicketLinkHTML(ppr.path)
    const To = await getEmailToSection(ppr.reporter_id, [
        EMAIL_RECIPIENTS.reporter,
    ])

    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailUPRApprovedToCoordinator = async (upr) => {
    const Subject = `[Ready to Buy] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `A new UW Finance Purchase Request has been approved! Please purchase the approved item(s).<br>
            After purchase, update the purchase order number and requisition number at the ticket link below.`
        ) +
        (await getUPRTicketInfoHTML(upr)) +
        getTicketLinkHTML(upr.path)
    const To = await getEmailToSection(upr.reporter_id, [
        EMAIL_RECIPIENTS.coordinator,
    ])

    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const PurchaseRequestInvalidated = (purchaseRequestDetails) => {
    const { issue, reporter } = purchaseRequestDetails

    let htmlComponent = `
        <div>
            Your WATO Purchase Request from ${issue.created.mediumDate} for{' '}
            ${issue.summary} has been invalidated for the following reason:
            ${issue.invalidated_reason}
            <br />
            This PR was for ${issue.request_funding_amount} CAD, and more details
            about it can be found <a href=${issue.toUrl}>here</a>. If you think
            this was a mistake, please reach out to the WATO Finance team. If
            you still need the purchase, please resubmit a <b>new</b> Purchase
            Request addressing the issues that caused this one to be
            invalidated.
        </div>
    `

    return {
        toName: `${reporter.emailAddress}`,
        CC: 'financegroup@watonomous.ca',
        subject: `Purchase Request update: ${issue.summary} has been invalidated!`,
        htmlPart: htmlComponent,
    }
}
const PersonalPurchaseApproved = (purchaseRequestDetails) => {
    const { issue, reporter } = purchaseRequestDetails

    const htmlComponent = `
        <div>
            Your WATO Purchase Request from ${issue.created.mediumDate} for{' '}
            ${issue.summary} is ready to be purchased! This PR was approved for{' '}
            ${issue.request_funding_amount} CAD, and more details about it can be
            found <a href=${issue.toUrl}>here</a>. Once you have purchased this
            item, please click{' '}
            <a
                href=https://finance.watonomous.ca/transition.php?transition_name=Purchased&issue=${issue.key}
            >
                this link
            </a>{' '}
            to update its status on Jira, and provide you with an email with
            further instructions on how to get reimbursed. Note:{' '}
            <b>
                You MUST keep the original receipt from your purchase in order
                to get reimbursed!
            </b>
        </div>
    `

    return {
        toName: `${reporter.emailAddress}`,
        CC: 'financegroup@watonomous.ca',
        subject: `WATonomous Purchase Request update: ${issue.summary} is ready to be purchased!!`,
        htmlPart: htmlComponent,
    }
}
const UWFinancePurchaseApproved = (purchaseRequestDetails) => {
    const { issue, reporter } = purchaseRequestDetails

    const htmlComponent = `
        <div>
            Your Purchase Request for <a href=${issue.toUrl}>${issue.summary}</a>{' '}
            has been approved and sent to UW Finance to be procured. You will be
            updated once UW Finance has been ordered.
        </div>
        `
    return {
        toName: `${reporter.emailAddress}`,
        CC: 'financegroup@watonomous.ca',
        subject: `Purchase Request update: ${issue.summary} has been approved!`,
        htmlPart: htmlComponent,
    }
}
const NewApprovedPurchaseRequest = (purchaseRequestIssueDetails) => {
    const { issue, triggerIssue } = purchaseRequestIssueDetails

    const {
        triggerIssueKey,
        reporter,
        triggerIssueSummary,
        admin_approval,
        request_funding_amount,
        purchase_link,
        purchase_instructions,
    } = triggerIssue

    const { issuekey, parent, issueSummary } = issue
    const htmlComponent = `
        <div>
            Hi, A new purchase has been requested by the WATonomous team.
            Details are below. <br />
            <br />
            Purchase Information: <br />
            WATO Internal Reference ID: ${triggerIssueKey} <br />
            Team member name: ${reporter.displayName} <br />
            Summary: ${triggerIssueSummary} <br />
            Faculty Advisor Approval: ${admin_approval} <br />
            Estimated Cost: ${request_funding_amount} <br />
            CAD Purchase Link: ${purchase_link} <br />
            Purchase Instructions: ${purchase_instructions} <br />
            <br />
            Funding Information: <br />
            WATO Internal Reference ID: ${issuekey} <br />
            Award name: ${parent.summary} <br />
            Award line item: ${issueSummary} <br />
            Award ID/Number (if available): ${parent.award_id} <br />
            Organization: ${parent.Organization} <br />
            Semester: ${parent.Semester.value} ${parent.Semester.child.value}{' '}
            <br />
            Links: <br />
            Click <a href=mailto:${reporter.emailAddress}>here</a> to
            contact the WATO member who requested this item for more details.{' '}
            <br />
            Click{' '}
            <a
                href=https://finance.watonomous.ca/invalidate.php?issue=${issuekey}
            >
                here
            </a>{' '}
            if you have first contacted the WATO member, and subsequently
            determined the order is invalid and can't progress. This status
            update cannot be undone. <br />
            Click{' '}
            <a
                href=
                    https://finance.watonomous.ca/reqnum.php?issue=${issuekey}
            >
                here
            </a>{' '}
            to update the requisition number. <br />
            Click{' '}
            <a
                href=https://finance.watonomous.ca/ordered.php?issue=${issuekey}
                
            >
                here
            </a>{' '}
            once the item has been ordered. <br />
            Click{' '}
            <a
                href=https://finance.watonomous.ca/ponum.php?issue=${issuekey}
                
            >
                here
            </a>{' '}
            to update the purchase order number and upload the PO document.
            <br />
            <br />
            Click{' '}
            <a
                href=https://finance.watonomous.ca/pickup.php?issue=${issuekey}
            >
                here
            </a>{' '}
            to add non-default pickup instructions. <br />
            Click{' '}
            <a
                href=https://finance.watonomous.ca/transition.php?transition_name=Arrived&issue=${issuekey}
            >
                here
            </a>{' '}
            if Central Stores contacts you about a purchase that hasn't been
            picked up.
        </div>
    )`
    return {
        toName: 'angeline.malloy@uwaterloo.ca',
        CC: 'drayside@uwaterloo.ca, team-captain@watonomous.ca, financegroup@watonomous.ca',
        subject: `WATonomous - New Purchase request`,
        htmlPart: htmlComponent,
    }
}
const PurchaseRequestOrdered = (purchaseRequestDetails) => {
    const { issue, triggerIssue, reporter } = purchaseRequestDetails

    const htmlComponent = `
        <div>
            Your WATO Purchase Request from {issue.created.mediumDate} for{' '}
            {issue.summary} has been ordered. This PR was approved for{' '}
            {issue.customfield_10412} CAD, and more details about it can be
            found <a href={issue.toUrl}>here</a>. The item will be shipped to
            Central Stores, who will email you once it has arrived. Once you get
            that email, please click{' '}
            <a
                href={
                    'https://finance.watonomous.ca/transition.php?transition_name=Arrived&issue=' +
                    ${triggerIssue.key}
                }
            >
                this link
            </a>{' '}
            to update its status on Jira.
        </div>
        `
    return {
        toName: `${reporter.emailAddress}`,
        CC: 'financegroup@watonomous.ca',
        subject: `Purchase Request update: ${issue.summary} has been ordered!`,
        htmlPart: htmlComponent,
    }
}
const PurchaseRequestArrived = (purchaseRequestDetails) => {
    const { issue, reporter } = purchaseRequestDetails
    const htmlComponent = `
        <div>
            Your WATO Purchase Request from {issue.created.mediumDate} for{' '}
            ${issue.summary} has arrived! Yay!! This PR was approved for{' '}
            ${issue.customfield_10412} CAD, and more details about it can be
            found <a href=${issue.toUrl}>here</a>. Once you have picked up this
            item, please click{' '}
            <a
                href=https://finance.watonomous.ca/transition.php?transition_name=Picked%20Up&issue=${issue.key}
                
            >
                this link
            </a>{' '}
            to update its status on Jira.
        </div>
    `
    return {
        toName: reporter.emailAddress,
        CC: 'team-captain@watonomous.ca, financegroup@watonomous.ca',
        subject: `Purchase Request update: ${issue.summary} has arrived!!`,
        htmlPart: htmlComponent,
    }
}
const SubmitReimbursementClaimToSponsorshipFund = (issueDetails) => {
    const { key } = issueDetails
    const htmlComponent = `
        <div>
            Hi, An award is ready to be claimed. Please{' '}
            <a href=https://finance.watonomous.ca/claim.php?issue=${key}>
                visit this link
            </a>{' '}
            to view items which need to be claimed{' '}
            {'(including requisition numbers)'}. Make sure you update their
            status as you claim them.
        </div>
    `
    return {
        toName: `angeline.malloy@uwaterloo.ca`,
        CC: 'financegroup@watonomous.ca',
        subject: `WATonomous - Time to claim the award`,
        htmlPart: htmlComponent,
    }
}
const ReimburseReporter = (claimFormDetails) => {
    const { issue, triggerIssue, webhookData } = claimFormDetails
    const { key, parent, summary } = issue
    const htmlComponent = `
        <div>
            Hi, <br />
            <br />A new claim form has been prepared for a Cash Reimbursement to
            a member of the WATonomous team. Please{' '}
            <a
                href=https://finance.watonomous.ca/claim_forms/expense_claim_form_${triggerIssue.key}.xlsx
                download
            >
                click here
            </a>{' '}
            to view the claim form and{' '}
            <a
                href={https://finance.watonomous.ca/receipts/receipt_${triggerIssue.key}.pdf}
                download
            >
                here
            </a>{' '}
            to view their supporting documents. Below is the claimant
            certification, as typed by the reimbursement requester:
            ${webhookData.claimant_cert} <br />
            <br />
            Funding Information: WATO Internal Reference ID: ${key} <br />
            Award name: ${parent.summary} <br />
            Award line item: ${summary} <br />
            Award ID/Number (if available): ${parent.customfield_10416}
            <br />
            Organization: ${parent.Organization} <br />
            Semester: ${parent.Semester.value} ${parent.Semester.child.value}
            <br />
        </div>
        `
    return {
        toName: `angeline.malloy@uwaterloo.ca`,
        CC: 'drayside@uwaterloo.ca, team-captain@watonomous.ca',
        subject: `WATonomous - Cash Reimbursement Claim`,
        htmlPart: htmlComponent,
    }
}
const PaidPersonalPurchaseReimbursementClaimInstructions = (
    claimReimbursementDetails
) => {
    const { issue, reporter } = claimReimbursementDetails

    const htmlComponent = `
        <div>
            You recently purchased ${issue.summary}. In order to get reimbursed,
            you should visit{' '}
            <a
                href=https://finance.watonomous.ca/claimform.php?issue=${issue.key}
            >
                this link
            </a>{' '}
            and follow the instructions there. This will generate and submit
            your claim and supporting documentation to UW Finance. Once you have
            successfully gotten reimbursed, please click{' '}
            <a
                href=https://finance.watonomous.ca/transition.php?transition_name=Paid&issue=${issue.key}
            >
                this link
            </a>
            .
        </div>
        `
    return {
        toName: `${reporter.emailAddress}`,
        subject: `Purchase Request update: ${issue.summary} has arrived!!`,
        htmlPart: htmlComponent,
    }
}

module.exports = {
    sendEmailPPRCreatedToApprovers,
    sendEmailUPRCreatedToApprovers,
    sendEmailPPRApprovedToReporter,
    sendEmailUPRApprovedToCoordinator,
    PurchaseRequestInvalidated,
    PersonalPurchaseApproved,
    UWFinancePurchaseApproved,
    NewApprovedPurchaseRequest,
    PurchaseRequestOrdered,
    PurchaseRequestArrived,
    SubmitReimbursementClaimToSponsorshipFund,
    ReimburseReporter,
    PaidPersonalPurchaseReimbursementClaimInstructions,
}

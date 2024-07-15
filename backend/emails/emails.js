const { EMAIL_RECIPIENTS, ADMIN_GROUP_EMAIL } = require('../models/constants')
const { sendEmail } = require('../service/sendEmail')
const { getUserByUID } = require('../service/users.service')

const FINANCE_GROUP_EMAIL = 'finance@watonomous.ca'

const currencyFormatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
})

const getEmailToSection = async (reporter_id, recipients) => {
    const emailToSet = new Set([ADMIN_GROUP_EMAIL])

    if (recipients.includes(EMAIL_RECIPIENTS.admin)) {
        emailToSet.add(ADMIN_GROUP_EMAIL)
    }

    if (recipients.includes(EMAIL_RECIPIENTS.coordinator)) {
        // emailToSet.add('studentdesigncentreengineering@uwaterloo.ca')
    }

    if (recipients.includes(EMAIL_RECIPIENTS.faculty_advisor)) {
        // TODO: emailToSet.add('drayside@uwaterloo.ca')
    }

    if (recipients.includes(EMAIL_RECIPIENTS.finance)) {
        // emailToSet.add(process.env.WATO_FINANCE_FINANCE_EMAIL)
    }

    if (recipients.includes(EMAIL_RECIPIENTS.reporter)) {
        const reporter = await getUserByUID(reporter_id)
        if (reporter.email) {
            emailToSet.add(reporter.email)
        }
    }

    return [...emailToSet].map((Email) => ({ Email }))
}

const getMainMessageHTML = (msg) => `<p>${msg}</p>`

const getPPRTicketInfoHTML = async (ppr) => {
    const reporter = await getUserByUID(ppr.reporter_id)
    const reporterEmail = reporter.email ? `&lt;${reporter.email}&gt;` : ''
    return `
        <p>
            Ticket Code: ${ppr.code} <br />
            Ticket Name: ${ppr.name} <br />
            Cost: CAD ${currencyFormatter.format(ppr.cost)} <br />
            Purchase URL: ${ppr.purchase_url} <br />
            Purchase Justification: ${ppr.purchase_justification} <br />
            Status: ${ppr.status} <br />
            Reporter: ${reporter.displayName} ${reporterEmail} <br />
            Created: ${new Date(ppr.createdAt).toDateString()}
        </p>
    `
}

const getUPRTicketInfoHTML = async (upr) => {
    const reporter = await getUserByUID(upr.reporter_id)
    const reporterEmail = reporter.email ? `&lt;${reporter.email}&gt;` : ''
    return `
        <p>
            Ticket Code: ${upr.code} <br />
            Ticket Name: ${upr.name} <br />
            Cost: CAD ${currencyFormatter.format(upr.cost)} <br />
            Purchase URL: ${upr.purchase_url} <br />
            Purchase Instructions: ${upr.purchase_instructions} <br />
            Purchase Justification: ${upr.purchase_justification} <br />
            Status: ${upr.status} <br />
            Reporter: ${reporter.displayName} ${reporterEmail} <br />
            Created: ${new Date(upr.createdAt).toDateString()}
        </p>
    `
}

const getSFTicketInfoHTML = async (sf) => {
    const reporter = await getUserByUID(sf.reporter_id)
    const reporterEmail = reporter.email ? `&lt;${reporter.email}&gt;` : ''
    return `
        <p>
            Ticket Code: ${sf.code} <br />
            Sponsorship Fund: ${sf.name} <br />
            Allocated Funding: CAD ${currencyFormatter.format(
                sf.funding_allocation
            )} <br/ >
            Funding Spent: CAD ${currencyFormatter.format(
                sf.funding_spent
            )} <br />
            ${sf.proposal_url ? `Proposal URL: ${sf.proposal_url} <br />` : ``}
            ${
                sf.presentation_url
                    ? `Presentation URL: ${sf.presentation_url} <br />`
                    : ``
            }
            Status: ${sf.status} <br />
            Reporter: ${reporter.displayName} ${reporterEmail} <br />
            Created: ${new Date(sf.createdAt).toDateString()} <br />
            Claim Deadline: ${new Date(sf.claim_deadline).toDateString()} <br />
        </p>
    `
}

const getTicketLinkHTML = (ticketPath) => `
    <p>
        View the ticket here: 
        <a
            href=${process.env.WATO_FINANCE_CLIENT_URL}${ticketPath}
        >
            ${process.env.WATO_FINANCE_CLIENT_URL}${ticketPath}
        </a>
    </p>
`

// ******************** UPR EMAILS ********************

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
        EMAIL_RECIPIENTS.admin,
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

const sendEmailUPRPurchasedToReporter = async (upr) => {
    const Subject = `[Ordered] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Your UW Finance Purchase Request has been ordered! When the item is ready to be picked up, we will let you know.`
        ) +
        (await getUPRTicketInfoHTML(upr)) +
        getTicketLinkHTML(upr.path)
    const To = await getEmailToSection(upr.reporter_id, [
        EMAIL_RECIPIENTS.reporter,
    ])

    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailUPRPurchasedToCoordinator = async (upr) => {
    const Subject = `[Ordered] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            'Thanks for ordering the item(s)! When the item is ready to be picked up, please update the ticket below.'
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

const sendEmailUPRReadyForPickupToReporter = async (upr) => {
    const Subject = `[Ready for pickup] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            'Your UW Finance Request is ready to be picked up! Please view the ticket below for pickup instructions and confirm when you have picked it up.'
        ) +
        (await getUPRTicketInfoHTML(upr)) +
        getTicketLinkHTML(upr.path)
    const To = await getEmailToSection(upr.reporter_id, [
        EMAIL_RECIPIENTS.reporter,
    ])

    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

// ******************** PPR EMAILS ********************

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
        EMAIL_RECIPIENTS.admin,
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

const sendEmailPPRPurchasedAndReceiptsSubmittedToCoordinator = async (ppr) => {
    const Subject = `[Purchased And Receipts Submitted] ${ppr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Item ${ppr.codename} has been purchased and receipts have been submitted! Please review the expense claim form and reimburse the reporter out of WATonomous' cash account.`
        ) +
        (await getPPRTicketInfoHTML(ppr)) +
        getTicketLinkHTML(ppr.path)
    const To = await getEmailToSection(ppr.reporter_id, [
        EMAIL_RECIPIENTS.coordinator,
    ])
    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailPPRReimbursedToReporter = async (ppr) => {
    const Subject = `[Reimbursed] ${ppr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Your Personal Purchase Request has been reimbursed! Please visit the ticket link below to confirm your reimbursement has been received.`
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

// ******************** SF EMAILS ********************

const sendEmailSFReimbursementRequestToCoordinator = async (sf) => {
    const Subject = `[Action Needed] Submit Reimbursement Request ${sf.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Please review the claim and submit a reimbursement request for ${sf.codename}. Once submitted, please visit the ticket link below to confirm that you have submitted it.`
        ) +
        (await getSFTicketInfoHTML(sf)) +
        getTicketLinkHTML(sf.path)
    const To = await getEmailToSection(sf.reporter_id, [
        EMAIL_RECIPIENTS.coordinator,
    ])
    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailSFConfirmReimbursementSubmitToCoordinator = async (sf) => {
    const Subject = `[Action Needed] Confirm Reimbursement Received ${sf.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Once the sponsorship fund for ${sf.codename} has reimbursed us, please visit the ticket link below to confirm it.`
        ) +
        (await getSFTicketInfoHTML(sf)) +
        getTicketLinkHTML(sf.path)
    const To = await getEmailToSection(sf.reporter_id, [
        EMAIL_RECIPIENTS.coordinator,
    ])
    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

const sendEmailSFReimbursementReceivedToTeam = async (sf) => {
    const Subject = `[Reimbursed] ${sf.codename}`
    const HTMLPart =
        getMainMessageHTML(`${sf.codename} has been reimbursed!`) +
        (await getSFTicketInfoHTML(sf)) +
        getTicketLinkHTML(sf.path)
    const To = await getEmailToSection(sf.reporter_id, [
        EMAIL_RECIPIENTS.coordinator,
    ])
    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

module.exports = {
    sendEmailUPRCreatedToApprovers,
    sendEmailUPRApprovedToCoordinator,
    sendEmailUPRPurchasedToReporter,
    sendEmailUPRPurchasedToCoordinator,
    sendEmailUPRReadyForPickupToReporter,
    sendEmailPPRCreatedToApprovers,
    sendEmailPPRApprovedToReporter,
    sendEmailPPRPurchasedAndReceiptsSubmittedToCoordinator,
    sendEmailPPRReimbursedToReporter,
    sendEmailSFReimbursementRequestToCoordinator,
    sendEmailSFConfirmReimbursementSubmitToCoordinator,
    sendEmailSFReimbursementReceivedToTeam,
}

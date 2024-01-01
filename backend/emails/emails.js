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
    const emailToSet = new Set(process.env.EMAIL_RECIPIENTS?.split(','))

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

const getSFTicketInfoHTML = async (sf) => {
    const reporter = await getUserByUID(sf.reporter_id)
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
            Reporter: ${reporter.displayName} &lt;${reporter.email}&gt; <br />
            Created: ${new Date(sf.createdAt).toDateString()} <br />
            Claim Deadline: ${new Date(sf.claim_deadline).toDateString()} <br />
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

const sendEmailUPRPurchasedToReporter = async (upr) => {
    const Subject = `[Purchased] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Your UW Finance Purchase Request has been purchased! When the item is ready to be picked up, we will let you know.`
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
    const Subject = `[Purchased] ${upr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            'Thanks for purchasing the item(s)! When the item is ready to be picked up, please update the ticket below.'
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

const sendEmailUPRReadyForPickupToCoordinator = async (upr) => {
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

const sendEmailPPRPurchasedAndReceiptsSubmittedToCoordinator = async (ppr) => {
    const Subject = `[Purchased And Receipts Submitted] ${ppr.codename}`
    const HTMLPart =
        getMainMessageHTML(
            `Item ${ppr.codename} has been purchased and receipts have been submitted! Please review the expense claim form and reimburse the reporter out of WATonomous' cash account.`
        ) +
        (await getPPRTicketInfoHTML(ppr)) +
        getTicketLinkHTML(ppr.path)
    const To = await getEmailToSection(ppr.reporter_id, [
        EMAIL_RECIPIENTS.finance,
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
        EMAIL_RECIPIENTS.finance,
        EMAIL_RECIPIENTS.coordinator,
    ])
    await sendEmail({
        Subject,
        HTMLPart,
        To,
    })
}

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
        EMAIL_RECIPIENTS.finance,
        EMAIL_RECIPIENTS.coordinator,
        EMAIL_RECIPIENTS.team_captain,
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
    sendEmailUPRReadyForPickupToCoordinator,
    sendEmailPPRApprovedToReporter,
    sendEmailPPRCreatedToApprovers,
    sendEmailPPRPurchasedAndReceiptsSubmittedToCoordinator,
    sendEmailPPRReimbursedToReporter,
    sendEmailSFReimbursementRequestToCoordinator,
    sendEmailSFConfirmReimbursementSubmitToCoordinator,
    sendEmailSFReimbursementReceivedToTeam,
}

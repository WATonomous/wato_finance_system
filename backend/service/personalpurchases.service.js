const PersonalPurchase = require('../models/personalpurchase.model')
const FundingItem = require('../models/fundingitem.model')
const {
    getAnnotatedPersonalPurchasesByIdList,
    getAnnotatedSponsorshipFundsByIdList,
} = require('./annotatedGetters')
const { sendEmail } = require('./sendEmail')
const { pprCreatedToApprovers } = require('../emails/emails')
const { getReporterHTMLByUID } = require('./users.service')

const getAllPersonalPurchases = () => {
    return getAnnotatedPersonalPurchasesByIdList()
}

const getPersonalPurchase = async (id) => {
    const PPR = await getAnnotatedPersonalPurchasesByIdList([id])
    return PPR[0]
}

const createPersonalPurchase = async (body) => {
    let newPPR = new PersonalPurchase(body)
    newPPR = await newPPR.save()
    newPPR = await getPersonalPurchase(newPPR._id)
    await FundingItem.findByIdAndUpdate(newPPR.fi_link, {
        $push: { ppr_links: newPPR._id },
    })
    const reporterHTML = await getReporterHTMLByUID(newPPR.reporter_id)

    sendEmail(pprCreatedToApprovers({ ...newPPR, reporterHTML }))
    return newPPR
}

const updatePersonalPurchase = (id, body) => {
    return PersonalPurchase.findByIdAndUpdate(id, body, {
        new: true,
    })
}

const updateFILinkPersonalPurchase = async (id, new_fi_link) => {
    const { fi_link: old_fi_link } = await getPersonalPurchase(id)
    await FundingItem.findByIdAndUpdate(old_fi_link, {
        $pull: { ppr_links: id },
    })
    await FundingItem.findByIdAndUpdate(new_fi_link, {
        $push: { ppr_links: id },
    })
    return PersonalPurchase.findByIdAndUpdate(
        id,
        { fi_link: new_fi_link },
        {
            new: true,
        }
    )
}

const updateApprovalsPersonalPurchase = (id, ticket_data) => {
    const personalPurchase = PersonalPurchase.findByIdAndUpdate(
        id,
        ticket_data,
        {
            new: true,
        }
    )
    const completedApprovals =
        personalPurchase.team_captain_approval &&
        personalPurchase.admin_approval &&
        personalPurchase.director_approval

    if (completedApprovals) {
        return personalPurchase.findByIdAndUpdate(
            id,
            {
                status: 'READY_TO_BUY',
            },
            {
                new: true,
            }
        )
    }

    // TODO: Transition status to 'SENT_TO_COORDINATOR' and auto send email
    return personalPurchase
}

const deletePersonalPurchase = async (id) => {
    const PPRtoDelete = await PersonalPurchase.findById(id)
    await FundingItem.findByIdAndUpdate(PPRtoDelete.fi_link, {
        $pull: { ppr_links: id },
    })
    return PPRtoDelete.remove()
}

const getSponsorshipFundByPPR = async (id) => {
    const personalPurchase = await PersonalPurchase.findById(id)
    const fundingItem = await FundingItem.findById(personalPurchase.fi_link)
    const sponsorshipFunds = await getAnnotatedSponsorshipFundsByIdList([
        fundingItem?.sf_link,
    ])
    return sponsorshipFunds[0]
}

module.exports = {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    updateFILinkPersonalPurchase,
    updateApprovalsPersonalPurchase,
    deletePersonalPurchase,
    getSponsorshipFundByPPR,
}

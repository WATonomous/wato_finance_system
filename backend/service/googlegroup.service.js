const GoogleGroup = require('../models/googlegroup.model')

const getAllGoogleGroups = () => {
    return GoogleGroup.find()
}

const getGoogleGroup = (identifier) => {
    // TODO: handle case where a user does not have a watiam.
    // This might happen if we get students from other universities (has happened before)
    return GoogleGroup.findOne({
        $or: [{ email: identifier }, { watiam: identifier }],
    })
}

const deleteUnrecognizedUsers = async (currentEmails, newEmails) => {
    //delete documents that no longer exist in the incoming rows
    const emailsToDelete = currentEmails.filter(
        (email) => !newEmails.includes(email)
    )
    await GoogleGroup.deleteMany({
        filter: { email: { $in: emailsToDelete } },
    })
    console.log('User Cleanup Successful')
}

const upsertUsers = async (newUsers) => {
    const bulkOps = []
    //update existing documents or add new ones
    newUsers.forEach((user) => {
        bulkOps.push({
            updateOne: {
                filter: { email: user.email },
                update: {
                    $set: {
                        watiam: user.watiam,
                        title: user.title,
                    },
                },
                upsert: true,
            },
        })
    })
    await GoogleGroup.bulkWrite(bulkOps)
    console.log('Updating users successful')
}

const updateGoogleGroups = async (body) => {
    const userDetails = body
    const newUserDetails = userDetails.map((user) => {
        const { email } = user
        const userWatiam = email.substring(0, email.indexOf('@'))
        return {
            ...user,
            watiam: userWatiam,
        }
    })

    const currentGroups = await getAllGoogleGroups()
    // currentEmails comes from our database, which needs to be synced from our sheet
    const currentEmails = currentGroups.map((group) => group.email)
    // new emails comes directly from our sheet, which is our source of truth
    const newEmails = newUserDetails.map((userDetail) => userDetail.email)
    await deleteUnrecognizedUsers(currentEmails, newEmails)
    await upsertUsers(newUserDetails)
}

module.exports = {
    getAllGoogleGroups,
    getGoogleGroup,
    updateGoogleGroups,
}

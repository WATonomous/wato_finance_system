const GoogleGroup = require('../models/googlegroup.model')

const getAllGoogleGroupsControl = async (_, res) => {
    return getAllGoogleGroups()
}

const getAllGoogleGroups = async () => {
    return GoogleGroup.find()
}

const getGoogleGroupControl = async (identifier) => {
    return getGoogleGroup(identifier)
}

const getGoogleGroup = async (identifier) => {
    return await GoogleGroup.findOne({
        $or: [{ email: identifier }, { watiam: identifier }],
    })
}

const deleteUsers = async (currentEmails, newEmails) => {
    //delete documents that no longer exist in the incoming pairs
    const emailsToDelete = currentEmails.filter(
        (email) => !newEmails.includes(email)
    )
    await GoogleGroup.deleteMany({
        filter: { email: { $in: emailsToDelete } },
    })
    console.log('User Cleanup Successful')
}

const upsertUsers = async (newPairs) => {
    const bulkOps = []
    //update existing documents or add new ones
    newPairs.forEach((pair) => {
        bulkOps.push({
            updateOne: {
                filter: { email: pair.email },
                update: {
                    $set: {
                        watiam: pair.watiam,
                        title: pair.title,
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
    const newEmails = newUserDetails.map((pair) => pair.email)
    await deleteUsers(currentEmails, newEmails)
    await upsertUsers(currentEmails, newUserDetails)
}

module.exports = {
    getAllGoogleGroupsControl,
    getAllGoogleGroups,
    getGoogleGroupControl,
    getGoogleGroup,
    updateGoogleGroups,
}
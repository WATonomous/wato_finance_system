const GoogleGroup = require('../models/googlegroup.model')

const getAllGoogleGroupsControl = async (_, res) => {
    try {
        const allPairs = await getAllGoogleGroups()
        await res.status(200).json(allPairs)
    } catch (err) {
        console.log('Error: ' + err)
    }
}

const getAllGoogleGroups = async () => {
    try {
        const allPairs = await GoogleGroup.find()
        return allPairs
    } catch (err) {
        console.log('Error: ' + err)
    }
}

const getGoogleGroup = async (req, res) => {
    const { identifier } = req.params
    try {
        const userGroup = await GoogleGroup.findOne({
            $or: [{ email: identifier }, { watiam: identifier }],
        })
        res.status(200).json(userGroup)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const deleteUsers = async (currentEmails, newEmails) => {
    //delete documents that no longer exist in the incoming pairs
    const emailsToDelete = currentEmails.filter(
        (email) => !newEmails.includes(email)
    )
    await GoogleGroup.deleteMany({
        filter: { email: { $in: emailsToDelete } },
    })
    console.log('Deletion successful')
}

const upsertUsers = async (currentEmails, newPairs) => {
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
    console.log('Update successful')
}

const updateGoogleGroups = async (req, res) => {
    const userDetails = req.body
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
    try {
        await deleteUsers(currentEmails, newEmails)
        await upsertUsers(currentEmails, newUserDetails)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

module.exports = {
    getAllGoogleGroupsControl,
    getGoogleGroup,
    updateGoogleGroups,
}

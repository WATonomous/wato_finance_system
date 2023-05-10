const GoogleGroup = require('../models/googlegroup.model')

const getAllGoogleGroups = async () => {
    try {
        const allPairs = await GoogleGroup.find()
        return allPairs
    } catch (err) {
        console.log('Error: ' + err)
    }
}

const getGoogleGroup = async (req, res) => {
    const { field, useEmail } = req.body
    try {
        let userGroup = {}
        if (useEmail) {
            userGroup = await GoogleGroup.findOne({ email: field })
        } else {
            userGroup = await GoogleGroup.findOne({ watiam: field })
        }
        res.status(200).json(userGroup)
        return userGroup
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const deleteEmails = async (currentEmails, newEmails) => {
    const emailsToDelete = currentEmails.filter(
        (email) => !newEmails.includes(email)
    )

    const bulkOps = []
    //delete documents that no longer exist in the incoming pairs
    if (emailsToDelete.length > 0) {
        bulkOps.push({
            deleteMany: {
                filter: { email: { $in: emailsToDelete } },
            },
        })
    }
    await GoogleGroup.bulkWrite(bulkOps)
    console.log('Deletion successful')
}

const updateOrAddEmails = async (currentEmails, newPairs) => {
    const bulkOps = []
    //update existing documents or add new ones
    if (newPairs !== null) {
        newPairs.forEach((pair) => {
            if (!currentEmails.includes(pair.email)) {
                bulkOps.push({
                    insertOne: {
                        document: pair,
                    },
                })
            } else {
                const currentPair = currentPairs.find(
                    (existingPair) => pair.email === existingPair.email
                )
                if (currentPair.title !== pair.title) {
                    bulkOps.push({
                        updateOne: {
                            filter: { email: currentPair.email },
                            update: {
                                $set: {
                                    watiam: pair.watiam,
                                    title: pair.title,
                                },
                            },
                        },
                    })
                }
            }
        })
    }
    await GoogleGroup.bulkWrite(bulkOps)
    console.log('Update successful')
}

const updateGoogleGroups = async (req, res) => {
    const newPairs = req.body

    const currentEmails = await getAllGoogleGroups()

    const newEmails = newPairs.map((pair) => pair.email)
    try {
        await deleteEmails(currentEmails, newEmails)
        await updateOrAddEmails(currentEmails, newPairs)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

module.exports = { getAllGoogleGroups, getGoogleGroup, updateGoogleGroups }

const GoogleGroup = require('../models/googlegroup.model')

const getAllGoogleGroups = async () => {
    try {
        let result = []
        const allPairs = await GoogleGroup.find()
        allPairs.map((pair) => result.push(pair))
        console.log('Fetched all google group pairs')
        return result
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

const updateGoogleGroups = async (req, res) => {
    const newPairs = req.body

    const currentPairs = await getAllGoogleGroups()

    const currentEmails = currentPairs.map((pair) => pair.email)
    const newEmails = newPairs.map((pair) => pair.email)

    const emailsToDelete = currentEmails.filter(
        (email) => !newEmails.includes(email)
    )
    try {
        const bulkOps = []
        //delete documents that no longer exist in the incoming pairs
        if (emailsToDelete.length > 0) {
            bulkOps.push({
                deleteMany: {
                    filter: { email: { $in: emailsToDelete } },
                },
            })
        }
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
        res.status(200).json('Update successful')
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

module.exports = { getAllGoogleGroups, getGoogleGroup, updateGoogleGroups }

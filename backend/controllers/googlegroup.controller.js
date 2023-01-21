const GoogleGroup = require('../models/googlegroup.model')

const getAllGoogleGroups = async (_, res) => {
    try {
        const allPairs = await GoogleGroup.find()
        let result = []
        allPairs.map((pair) => result.push(pair))
        return result
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getGoogleGroup = (req, res) => {
    const { email } = req.body
    GoogleGroup.findOne({ email })
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
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
                                update: { $set: { title: pair.title } },
                            },
                        })
                    }
                }
            })
        }
        await GoogleGroup.bulkWrite(bulkOps)
        console.log('Update successful')
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

module.exports = { getAllGoogleGroups, getGoogleGroup, updateGoogleGroups }

const {
    getAllGoogleGroupsControl,
    getGoogleGroupControl,
    updateGoogleGroups,
} = require('../service/googlegroup.service')

const getAllGoogleGroupsController = async (_, res) => {
    return getAllGoogleGroupsControl()
        .then((allPairs) => res.status(200).json(allPairs))
        .catch((error) => res.status(500).json(error))
}

const getGoogleGroupController = async (req, res) => {
    const { identifier } = req.params
    return getGoogleGroupControl(identifier)
        .then((userGroup) => res.status(200).json(userGroup))
        .catch((error) => res.status(500).json(error))
}

const updateGoogleGroupsController = async (req, res) => {
    const userDetails = req.body
    return updateGoogleGroups(userDetails)
        .then(() => res.status(200).json('Google Groups updated successfully'))
        .catch((error) => res.status(500).json(error))
}

module.exports = {
    getAllGoogleGroupsController,
    getGoogleGroupController,
    updateGoogleGroupsController,
}

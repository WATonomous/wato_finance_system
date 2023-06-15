const {
    getAllGoogleGroups,
    getGoogleGroup,
    updateGoogleGroups,
} = require('../service/googlegroup.service')

const getAllGoogleGroupsController = async (_, res) => {
    return getAllGoogleGroups()
        .then((userGroups) => res.status(200).json(userGroups))
        .catch((error) => res.status(500).json(error))
}

const getGoogleGroupController = async (req, res) => {
    const { email } = req.params
    return getGoogleGroup(email)
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

const { getAllUsers } = require('../service/users.service')
const getAllUsersController = (_, res) => {
    getAllUsers()
        .then((userRecords) => {
            res.status(200).json(userRecords.users)
        })
        .catch((error) => res.status(500).json(error))
}

module.exports = {
    getAllUsersController,
}

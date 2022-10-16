let PersonalPurchase = require('../models/PersonalPurchase.model')

const getAllPersonalPurchases = (_, res) => {
    PersonalPurchase.find()
        .then((personalPurchases) => res.json(personalPurchases))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const getPersonalPurchase = (req, res) => {
    PersonalPurchase.findById(req.params.id)
        .then((personalPurchase) => res.json(personalPurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const createPersonalPurchase = (req, res) => {
    const { body } = req
    console.log(body)
    const newPersonalPurchase = new PersonalPurchase(body)

    newPersonalPurchase
        .save()
        .then(() => res.json(newPersonalPurchase))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const updatePersonalPurchase = (req, res) => {
    console.log(req.params.id)
    PersonalPurchase.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json(req.body))
        .catch((err) => res.status(400).json('Error: ' + err))
}

const deletePersonalPurchase = (req, res) => {
    PersonalPurchase.findByIdAndDelete(req.params.id)
        .then(() => res.json('PersonalPurchase deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err))
}

module.exports = {
    getAllPersonalPurchases,
    getPersonalPurchase,
    createPersonalPurchase,
    updatePersonalPurchase,
    deletePersonalPurchase
}

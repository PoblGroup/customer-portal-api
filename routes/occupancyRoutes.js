const express = require('express')
const { getOccupancies, newOccupancy, getSingleOccupancy, updateOccupancy, removeOccupancy, getTransactions, getCharges } = require('../controllers/occupancyController')
const router = express.Router()

router.route('/').get(getOccupancies).post(newOccupancy)
router.route('/:id').get(getSingleOccupancy).put(updateOccupancy).delete(removeOccupancy)
router.route('/:id/transactions').get(getTransactions)
router.route('/:id/charges').get(getCharges)

module.exports = {
    routes: router
}
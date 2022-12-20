const express = require('express')
const { getOccupancies, newOccupancy, getSingleOccupancy, updateOccupancy, removeOccupancy } = require('../controllers/occupancyController')
const router = express.Router()

router.route('/').get(getOccupancies).post(newOccupancy)
router.route('/:id').get(getSingleOccupancy).put(updateOccupancy).delete(removeOccupancy)

module.exports = {
    routes: router
}
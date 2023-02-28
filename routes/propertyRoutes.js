const express = require('express')
const { getProperties, newProperty, getSingleProperty, updateProperty, removeProperty, getPropertyCompliance } = require('../controllers/propertyController')
const router = express.Router()

router.route('/').get(getProperties).post(newProperty)
router.route('/:id').get(getSingleProperty).put(updateProperty).delete(removeProperty)
router.route('/:id/compliance').get(getPropertyCompliance)

module.exports = {
    routes: router
}
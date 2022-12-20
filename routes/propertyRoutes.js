const express = require('express')
const { getProperties, newProperty, getSingleProperty, updateProperty, removeProperty } = require('../controllers/propertyController')
const router = express.Router()

router.route('/').get(getProperties).post(newProperty)
router.route('/:id').get(getSingleProperty).put(updateProperty).delete(removeProperty)

module.exports = {
    routes: router
}
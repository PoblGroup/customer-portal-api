const express = require('express')
const { getSingleContact, updateContact, getContacts, newContact, removeContact, newContactPreference } = require('../controllers/contactController')
const router = express.Router()

router.route('/').get(getContacts).post(newContact)
router.route('/:id').get(getSingleContact).put(updateContact).delete(removeContact)
router.route('/preferences/:id').post(newContactPreference)

module.exports = {
    routes: router
}
const express = require('express')
const { getSingleContact, updateContact, getContacts, newContact, removeContact, newContactPreference, getContactLookups, getContactPreferences, getContactPreferenceLookups } = require('../controllers/contactController')
const router = express.Router()

router.route('/').get(getContacts).post(newContact)
router.route('/preferences/lookups').get(getContactPreferenceLookups)
router.route('/preferences/:id').post(newContactPreference).get(getContactPreferences)
router.route('/lookups').get(getContactLookups)
router.route('/:id').get(getSingleContact).put(updateContact).delete(removeContact)

module.exports = {
    routes: router
}
const express = require('express')
const { getSingleContact, updateContact, getContacts, newContact, removeContact } = require('../controllers/contactController')
const router = express.Router()

router.route('/').get(getContacts).post(newContact)
router.route('/:id').get(getSingleContact).put(updateContact).delete(removeContact)

module.exports = {
    routes: router
}
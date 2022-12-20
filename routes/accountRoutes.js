const express = require('express')
const { getAccounts, newAccount, getSingleAccount, updateAccount, removeAccount } = require('../controllers/accountController')
const router = express.Router()

router.route('/').get(getAccounts).post(newAccount)
router.route('/:id').get(getSingleAccount).put(updateAccount).delete(removeAccount)

module.exports = {
    routes: router
}
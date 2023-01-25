const express = require('express')
const { getUsers, createUser, getUser, updateUser, authUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(getUsers).post(createUser)
router.route('/login').post(authUser)
router.route('/:id').get(getUser).put(updateUser)

module.exports = {
    routes: router
}
const express = require('express')
const { getCases, newComplaint, newCompliment, newAsb, newGeneralEnquiry, newTenancyEnd, newPermissionRequest } = require('../controllers/caseController')
const router = express.Router()

router.route('/').get(getCases)
router.route('/complaint').post(newComplaint)
router.route('/compliment').post(newCompliment)
router.route('/asb').post(newAsb)
router.route('/generalenquiry').post(newGeneralEnquiry)
router.route('/tenancyend').post(newTenancyEnd)    
router.route('/permissionrequest').post(newPermissionRequest)    

module.exports = {
    routes: router
}
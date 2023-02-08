const express = require('express')
const { getRepair, getTemplates, getRepairCases, createRepairCase, createRepairJob, getRepairJobs, getTemplateJobs, getAvailableAppointments, bookAppointment } = require('../controllers/repairController')

const router = express.Router()

router.route('/').get(getRepairJobs).post(createRepairJob)
router.route('/case').get(getRepairCases).post(createRepairCase).put()
router.route('/templates').get(getTemplates)
router.route('/templates/jobs/:id').get(getTemplateJobs)
router.route('/appointments').get(getAvailableAppointments).post(bookAppointment)
router.route('/:id').get(getRepair)
router.route('/:id/appointments').get()


module.exports = {
    routes: router
}
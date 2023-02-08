const { restart } = require("nodemon")
const { GetMaintenanceCases, CreateMaintenanceCase, GetMaintenanceTemplates, GetTemplateJobs, GetMaintenanceCase, GetSingleTemplate, GetProjectCode, GetContractor, UpdateMaintenanceCase, CreateMaintenanceJob, GetFlowSettings, RunFlow, GetMaintenanceJob, ServiceConnectToken, GetServiceConnectAppointments, CreateBookingServiceConnect, CreateBookingDynamics } = require("../data/repairs")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")

const getRepairCases = async (req, res) => {
    const { id } = req.query
    const { access_token } = await GetDynamicsToken()

    if(!id)
        return res.status(400).json({ error:'Id Parameter Not Found' })

    try {
        let repairs = await GetMaintenanceCases(access_token, id)
        return res.status(200).json(repairs)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const getRepair = async (req, res) => {
    res.send('Single Repair')
}

const createRepairCase = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { accountId, propertyId } = req.body

    try {
        const created = await CreateMaintenanceCase(access_token, accountId, propertyId)

        if(created) {
            return res.status(200).json(created)
        } else {
            return res.send('Could not create case')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const updateRepairCase = async (req, res) => {
    const { access_token } = await GetDynamicsToken()

    try {
        const updated = await UpdateMaintenanceCase(access_token, id, req.body)
        if (updated) {
            return res.status(200).json({ message: 'Maintenance Case Updated' })
        } else {
            return res.status(400).json({ error: 'Problem updating case' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const getTemplates = async (req, res) => {
    const { location, item } = req.query
    const { access_token } = await GetDynamicsToken()

    try {
        const templates = await GetMaintenanceTemplates(access_token, location, item)
        res.status(200).json(templates)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const getTemplateJobs = async (req, res) => {
    const { id } = req.params
    const { access_token } = await GetDynamicsToken()

    try {
        const jobs = await GetTemplateJobs(access_token, id)
        res.status(200).json(jobs)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const getRepairJobs = async (req, res) => {
    res.send('Repair Jobs')
}

const createRepairJob = async (req, res) => {
    const { caseId, templateId, description, accessDetails } = req.body
    const { access_token } = await GetDynamicsToken()
    let cit

    let newJob = {
        caseId,
        templateId,
        description,
        accessDetails,
        triggersubmissionapproval: false,
        usediagnostics: false
    }

    // Get Maintenance Case
    const maintCase = await GetMaintenanceCase(access_token, caseId)
    newJob.accountId = maintCase._pobl_maintcaseaccountid_value
    newJob.propertyId = maintCase._pobl_maintcasepropertyid_value

    // Get Template
    const template = await GetSingleTemplate(access_token, templateId)
    newJob.contractId = template._pobl_contractid_value;
    newJob.vatCodeId = template._pobl_vatcodeid_value;
    newJob.activityCodeId = template._pobl_activitycodeid_value;
    newJob.costCentreId = template._pobl_costcentreid_value;
    newJob.workTypeId = template. _pobl_worktypeid_value;

    // Get Project Code
    const projectCode = await GetProjectCode(access_token, newJob.propertyId)
    newJob.projectCodeId = projectCode

    // Get Contractor
    const contractor = await GetContractor(access_token, newJob.contractId)
    newJob.supplierId = contractor._pobl_supplier_value;
    newJob.priceListId = contractor._pobl_defaultpricelistid_value;
    cit = contractor.pobl_contractinterfacetype

    // Get Template Jobs
    const jobs = await GetTemplateJobs(access_token, templateId)
    newJob.templateJobs = jobs

    // Update Maintennce Case - Work Type
    await UpdateMaintenanceCase(access_token, newJob.caseId, { workTypeId: newJob.workTypeId })

    // Create Maintenance Job
    try {
        const created = await CreateMaintenanceJob(access_token, newJob)
        if (created) {
            if (cit == 771570002) {
                // Get & Run Approval Flow
                const approvalFlow = await GetFlowSettings(access_token, "Request Submission Approval")
                const { data, error } = await RunFlow(approvalFlow.pobl_attr1, {
                    "TriggeringUser": "c30d43ae-a0d9-eb11-bacb-00224800ffe8",
                    "JobId": created.maintJobId,
                    "BackgroundProcess": false
                })

                if(data.AutoApproved && data.RealtimeBooking) {
                    // Send Job to Service Connect
                    const serviceConnectflow = await GetFlowSettings(access_token, "'ServiceConnect' Create Job")
                    let { data, error } = await RunFlow(serviceConnectflow.pobl_attr1, { "JobId": created.maintJobId })
                    
                    if(error)
                        return res.status(500).json({ error: 'We could not send the job to our supplier, please get in touch with us to complete.' })

                    if(data)
                        return res.status(201).json(created)
                }
            }
        } else {
            return res.status(400).json({ error: 'Could not create maintenance job' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const getAvailableAppointments = async (req, res) => {
    const { id } = req.query
    const { access_token } = await GetDynamicsToken()
    let jobRef

    try {
        // Get Maintenance Job Ref
        const job = await GetMaintenanceJob(access_token, id)
        jobRef = job.ordernumber

        // Get Service Connect Token
        const token = await ServiceConnectToken()

        const availability = await GetServiceConnectAppointments(token, jobRef)
        return res.status(200).json(availability)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const bookAppointment = async (req, res) => {
    const { jobId, orderNumber, date, planningWindowId, name } = req.body
    const { access_token } = await GetDynamicsToken()
    const token = await ServiceConnectToken()

    const booking = {
        Date: moment(new Date(date)).format('YYYY-MM-DD'),
        PlanningWinId: planningWindowId,
        Slot: name
    }

    try {
        const { data, error} = await CreateBookingServiceConnect(orderNumber, booking, token)

        if(error)
            return res.status(400).json({ error: 'We couldnt book the appointment' })
        
        // Create Appointment in Dynamics
        const appOutcome = await GetAppointmentOutcome('Booked')

        const bookingSubmission = {
            jobId: jobId,
            ref: data.PrimaryOrderNumber,
            date: moment(new Date(data.Date)).format('MMMM Do, YYYY'),
            slot: AvailabilityTimesFix(data.PlanningWindow.StartHour, data.PlanningWindow.StartMinute) + "-" + AvailabilityTimesFix(data.PlanningWindow.EndHour, data.PlanningWindow.EndMinute)
        }

        const created = await CreateBookingDynamics(access_token, data, bookingSubmission, appOutcome)

        if(created) {
            return res.status(201).json({ message: 'Appointment Created' })
        } else {
            return res.status(400).json({ error: 'We couldnt book the appointment' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

module.exports = {
    getRepairCases,
    getRepair,
    createRepairCase,
    updateRepairCase,
    getTemplates,
    getTemplateJobs,
    getRepairJobs,
    createRepairJob,
    getAvailableAppointments,
    bookAppointment,
}
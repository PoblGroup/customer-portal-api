const { GetAllCases, NewComplaint, NewCompliment, NewAsb, NewTenancyEnd, NewPermissionRequest, NewGeneralEnquiry } = require("../data/cases")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")

const getCases = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const cases = await GetAllCases(access_token)
    res.send(cases)
}

const newComplaint = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { detail, type, accountId, contactId } = req.body

    let newComplaint = {
        detail,
        type,
        accountId,
        contactId
    }

    try {
        const updated = await NewComplaint(access_token, newComplaint)
        if(updated) return res.status(200).json({ message: 'New Complaint Added' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const newCompliment = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { category, categoryOther, detail, reportedDate, accountId } = req.body

    let newCompliment = {
        category,
        categoryOther,
        detail,
        reportedDate,
        accountId
    }

    try {
        const updated = await NewCompliment(access_token, newCompliment)
        if(updated) return res.status(200).json({ message: 'New Compliment Added' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const newAsb = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { poblTenant, mainCategory, subCategory, dateOfIncident, location, detail, policeContacted, logNicheNumber, complainant } = req.body

    let newAsb = {
        poblTenant,
        mainCategory,
        subCategory,
        dateOfIncident,
        location,
        detail,
        policeContacted,
        logNicheNumber,
        complainant
    }

    try {
        const updated = await NewAsb(access_token, newAsb)
        if(updated) return res.status(200).json({ message: 'New ASB Added' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const newGeneralEnquiry = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { type, subject, description, contactId } = req.body

    let newGeneralEnquiry = {
        type,
        subject,
        description,
        contactId
    }

    try {
        const updated = await NewGeneralEnquiry(access_token, newGeneralEnquiry)
        if(updated) return res.status(200).json({ message: 'New General Enquiry Added' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const newTenancyEnd = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { requestReason, requestOther, detail, requestDate, accountId, contractId } = req.body

    let newTenancyEnd = {
        requestReason,
        requestOther,
        detail,
        requestDate,
        accountId,
        contractId
    }

    try {
        const updated = await NewTenancyEnd(access_token, newTenancyEnd)
        if(updated) return res.status(200).json({ message: 'New Tenancy End Request Added' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const newPermissionRequest = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { requestType, requestOther, detail, requestDate, accountId, contractId, contactId } = req.body

    let newPermissionRequest = {
        requestType,
        requestOther,
        detail,
        requestDate,
        accountId,
        contractId,
        contactId
    }

    try {
        const updated = await NewPermissionRequest(access_token, newPermissionRequest)
        if(updated) return res.status(200).json({ message: 'New Permission Request Added' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}


module.exports = {
    getCases,
    newComplaint,
    newCompliment,
    newAsb,
    newGeneralEnquiry,
    newTenancyEnd,
    newPermissionRequest
}
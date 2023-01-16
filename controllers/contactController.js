const { GetAllContacts, GetContactByID, UpdateContact, CreateContactPreference } = require("../data/contact")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")
const { FormatTelephoneNumber } = require("../utils/formatTelehone")

const getContacts = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    try {
        const contacts = await GetAllContacts(access_token)
        return res.status(200).json({ data: contacts.value })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

const getSingleContact = async (req, res) => {
    const id = req.params.id
    const { access_token } = await GetDynamicsToken()

    if(!id) return res.status(404).json({ error: 'No Id Found in the Request' })
    
    try {
        const contact = await GetContactByID(access_token, id)
        return res.status(200).json(contact)
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
    
}

const updateContact = async (req, res) => {
    const id = req.params.id
    let newContactDetails = {
        id,
        title: req.body.title,
        dob: req.body.dob,
        tel1: FormatTelephoneNumber(req.body.tel1),
        tel1Type: req.body.tel1Type,
        tel2: FormatTelephoneNumber(req.body.tel2),
        tel2Type: req.body.tel2Type,
        email1: req.body.email1,
        email1Type: req.body.email1Type,
        email2: req.body.email2,
        email2Type: req.body.email2Type,
        gender: req.body.gender,
        martialStatus: req.body.martialStatus,
        ethnicOrigin: req.body.ethnicOrigin,
        sexualOrientation: req.body.sexualOrientation,
        economicStatus: req.body.economicStatus,
        nationalInsurance: req.body.nationalInsurance,
        language: req.body.language,
    }

    const { access_token } = await GetDynamicsToken()

    try {
        const updated = await UpdateContact(access_token, newContactDetails)
        
        if (!updated)
            return res.status(500).json({ message: "Something went wrong" });

        return res.status(200).json({
            updated: true,
            message: `Successfully updated contact!`,
        });
    } catch (error) {
        console.log(error)
    }
}

const newContact = async (req, res) => {
    res.send('New Contact')
}

const removeContact = async (req, res) => {
    res.send('Remove Contact')
}

const newContactPreference = async (req, res) => {
    const id = req.params.id
    const { channel, preference, effectiveDate } = req.body
    const { access_token } = await GetDynamicsToken()

    let newPreference = {
        channel, 
        preference, 
        effectiveDate
    }

    try {
        const createdPreference = await CreateContactPreference(access_token, newPreference, id) 
        
        if(!createdPreference)
            return res.status(500).json({ error: 'Something went wrong' })
        
        return res.status(201).json({
            data: newPreference,
            message: 'New Preference Added!'
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getContacts,
    getSingleContact,
    updateContact,
    newContact,
    removeContact,
    newContactPreference
}
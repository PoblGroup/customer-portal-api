const { GetAllContacts, GetContactByID, UpdateContact, CreateContactPreference, GetContactPreferences } = require("../data/contact")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")
const { FormatTelephoneNumber } = require("../utils/formatTelehone")
const { GetOptionSets, GetOptionSetLabel } = require("../utils/optionSets")

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
    let newContactDetails = {}

    newContactDetails.id = id
    req.body.title ? newContactDetails.title = req.body.title : null
    req.body.contactInitial ? newContactDetails.contactInitial = req.body.contactInitial : null
    req.body.dob ? newContactDetails.dob = req.body.dob : null
    req.body.telephone1 ? newContactDetails.tel1 = FormatTelephoneNumber(req.body.telephone1) : null
    req.body.telType1 ? newContactDetails.tel1Type = req.body.telType1 : null
    req.body.telephone2 ? newContactDetails.tel2 = FormatTelephoneNumber(req.body.telephone2) : null
    req.body.tel2Type ? newContactDetails.tel2Type = req.body.tel2Type : null
    req.body.emailAddress1 ? newContactDetails.email1 = req.body.emailAddress1 : null
    req.body.emailType1 ? newContactDetails.email1Type = req.body.emailType1 : null
    req.body.emailAddress2 ? newContactDetails.email2 = req.body.emailAddress2 : null
    req.body.emailType2 ? newContactDetails.email2Type = req.body.emailType2 : null
    req.body.gender ? newContactDetails.gender = req.body.gender : null
    req.body.maritalStatus ? newContactDetails.maritalStatus = req.body.maritalStatus : null
    req.body.ethnicOrigin ? newContactDetails.ethnicOrigin = req.body.ethnicOrigin : null
    req.body.sexualOrientation ? newContactDetails.sexualOrientation = req.body.sexualOrientation : null
    req.body.economicStatus ? newContactDetails.economicStatus = req.body.economicStatus : null
    req.body.nationalInsurance ? newContactDetails.nationalInsurance = req.body.nationalInsurance : null
    req.body.language ? newContactDetails.language = req.body.language : null
    req.body.preferredContact ? newContactDetails.preferredContact = req.body.preferredContact : null

    const { access_token } = await GetDynamicsToken()

    try {
        const updated = await UpdateContact(access_token, newContactDetails)
        
        if (!updated)
            return res.status(500).json({ error: "Something went wrong" });

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
    const { channels, preference, effectiveDate } = req.body
    const { access_token } = await GetDynamicsToken()

    let newPreference = {
        id,
        channels, 
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

const getContactPreferences = async (req, res) => {
    const id = req.params.id
    const { access_token } = await GetDynamicsToken()

    try {
        const contactPreferences = await GetContactPreferences(access_token, id) 
        
        if(!contactPreferences)
            return res.status(500).json({ error: 'Something went wrong' })

        let cpEmailOptions = await GetOptionSets(access_token, 'contact', 'pobl_contactpreferenceemail', true)
        let cpPhoneOptions = await GetOptionSets(access_token, 'contact', 'pobl_contactpreferencephone', true)
        let cpSmsOptions = await GetOptionSets(access_token, 'contact', 'pobl_contactpreferencesms', true)
        let cpPostalOptions = await GetOptionSets(access_token, 'contact', 'pobl_contactpreferencepostal', true)
        let cpSurveyOptions = await GetOptionSets(access_token, 'contact', 'pobl_contactpreferencesurvey', true)

        contactPreferences.pobl_contactpreferenceemail = cpEmailOptions.filter(x => x.value == contactPreferences.pobl_contactpreferenceemail)[0].label
        contactPreferences.pobl_contactpreferencephone = cpPhoneOptions.filter(x => x.value == contactPreferences.pobl_contactpreferencephone)[0].label
        contactPreferences.pobl_contactpreferencesms = cpSmsOptions.filter(x => x.value == contactPreferences.pobl_contactpreferencesms)[0].label
        contactPreferences.pobl_contactpreferencepostal = cpPostalOptions.filter(x => x.value == contactPreferences.pobl_contactpreferencepostal)[0].label
        contactPreferences.pobl_contactpreferencesurvey = cpSurveyOptions.filter(x => x.value == contactPreferences.pobl_contactpreferencesurvey)[0].label
        
        return res.status(201).json(contactPreferences)
    } catch (error) {
        console.log(error)
    }
}

const getContactPreferenceLookups = async (req, res) => {
    const { access_token } = await GetDynamicsToken()

    const preferredMethodOptions = await GetOptionSets(access_token, 'contact', 'preferredcontactmethodcode')   
    const channelOptions = await GetOptionSets(access_token, 'pobl_contactpreference', 'pobl_communicationschannel', false, true)   
    const preferenceOptions = await GetOptionSets(access_token, 'pobl_contactpreference', 'pobl_preference')   

    const lookups = {
        preferredMethods: preferredMethodOptions,
        channels: channelOptions,
        preferences: preferenceOptions
    }

    res.status(200).json(lookups)
}

const getContactLookups = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    
    const genderOptions = await GetOptionSets(access_token, 'contact', 'gendercode')
    const sexualOrientationOptions = await GetOptionSets(access_token, 'contact', 'pobl_sexualorientation')
    const maritalStatusOptions = await GetOptionSets(access_token, 'contact', 'familystatuscode')
    const ethnicOptions = await GetOptionSets(access_token, 'contact', 'pobl_ethnicorigin')
    const employmentOptions = await GetOptionSets(access_token, 'contact', 'pobl_economicstatus', true) // GLOBAL
    const languageOptions = await GetOptionSets(access_token, 'contact', 'pobl_language', true) // GLOBAL
    const emailTypeOptions = await GetOptionSets(access_token, 'contact', 'pobl_email1type', true) // GLOBAL
    const telTypeOptions = await GetOptionSets(access_token, 'contact', 'pobl_telephone1type', true) // GLOBAL

    const lookups = {
        gender: genderOptions,
        sexualOrientation: sexualOrientationOptions,
        martialStatus: maritalStatusOptions,
        ethnicOrigin: ethnicOptions,
        employement: employmentOptions,
        language: languageOptions,
        emailTypes: emailTypeOptions,
        telTypes: telTypeOptions
    }

    res.status(200).json(lookups)
}

module.exports = {
    getContacts,
    getSingleContact,
    updateContact,
    newContact,
    removeContact,
    newContactPreference,
    getContactLookups,
    getContactPreferences,
    getContactPreferenceLookups
}
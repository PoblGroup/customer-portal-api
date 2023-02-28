const axios = require('axios');
const { checkExistingContact } = require('../utils/queries');

const GetAllContacts = async (token) => {
    let contacts = null;

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            contacts = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

    return JSON.parse(contacts);
} 

const GetContactByID = async (token, id) => {
    const fields = [
        'salutation',
        'firstname',
        'lastname',
        'pobl_dob',
        'emailaddress1',
        'emailaddress2',
        'address1_telephone1',
        'address1_telephone2',
        'pobl_nationalinsurance',
        'gendercode',
        'pobl_sexualorientation',
        'familystatuscode',
        'pobl_ethnicorigin',
        'pobl_economicstatus',
        'pobl_language',
        'pobl_email1type',
        'pobl_email2type',
        'pobl_telephone1type',
        'pobl_telephone2type'
    ]
    let contact = null;

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts(${id})?$select=${fields.join(',')}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) { 
        //   console.log(JSON.stringify(response.data));
            contact = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

    return JSON.parse(contact);
} 

const UpdateContact = async (token, newContactDetails) => {
    let updated = false

    var data = {
        salutation: newContactDetails.title,
        pobl_contactinitial: newContactDetails.contactInitial,
        pobl_dob: newContactDetails.dob,
        address1_telephone1: newContactDetails.tel1,
        pobl_telephone1type: newContactDetails.tel1Type,
        address1_telephone2: newContactDetails.tel2,
        emailaddress1: newContactDetails.email1,
        pobl_email1type: newContactDetails.email1Type,
        emailaddress2: newContactDetails.email2,
        pobl_nationalinsurance: newContactDetails.nationalInsurance,
    };

    if(newContactDetails.tel2Type != "") 
        data.pobl_telephone2type = newContactDetails.tel2Type
    
    if(newContactDetails.email2Type != "") 
        data.pobl_email2type = newContactDetails.email2Type
    
    if(newContactDetails.gender != "") 
        data.gendercode = newContactDetails.gender

    if(newContactDetails.maritalStatus != "") 
        data.familystatuscode = newContactDetails.maritalStatus

    if(newContactDetails.ethnicOrigin != "") 
        data.pobl_ethnicorigin = newContactDetails.ethnicOrigin

    if(newContactDetails.sexualOrientation != "") 
        data.pobl_sexualorientation = newContactDetails.sexualOrientation
    
    if(newContactDetails.economicStatus != "") 
        data.pobl_economicstatus = newContactDetails.economicStatus
    
    if(newContactDetails.language != "") 
        data.pobl_language = newContactDetails.language
    
    if(newContactDetails.preferredContact != "")
        data.preferredcontactmethodcode = newContactDetails.preferredContact

    var config = {
        method: "patch",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts(${newContactDetails.id})`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    await axios(config)
        .then(function (response) {
            if (response.status == 204) updated = true;
        })
        .catch(function (error) {
            console.log(error.response.status, error.response.statusText);
            updated = false
        });

    return updated
}

const CreateContactPreference = async (token, newPreference, contactId) => {
    let created = false

    var data = {
        pobl_communicationschannel: newPreference.channels.join(',').toString(),
        pobl_preference: newPreference.preference,
        pobl_effectivedate: newPreference.effectiveDate,
        "pobl_Contact@odata.bind": "/contacts(" + contactId + ")" ,
        pobl_source: "771570000"
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_contactpreferences`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    await axios(config)
        .then(function (response) {
            if (response.status == 204) created = true;
        })
        .catch(function (error) {
            console.log(error.response.status, error.response.statusText);
            created = false
        });

    return created
}

const GetContactPreferences = async (token, id) => {
    const fields = [
        'pobl_contactpreferenceemail',
        'pobl_contactpreferencephone',
        'pobl_contactpreferencepostal',
        'pobl_contactpreferencesms',
        'pobl_contactpreferencesurvey',
        'preferredcontactmethodcode'
    ]
    let prefs = null;

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts(${id})?$select=${fields.join(',')}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) { 
        //   console.log(JSON.stringify(response.data));
            prefs = JSON.stringify(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

    return JSON.parse(prefs);
} 

const FindContact = async (token, obj) => {
    let data = null;
    let fetchxml = checkExistingContact(obj)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    return data;
}

module.exports = {
    GetAllContacts,
    GetContactByID, 
    UpdateContact,
    CreateContactPreference,
    FindContact,
    GetContactPreferences
}
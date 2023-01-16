const axios = require('axios')

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
    let contact = null;

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts(${id})`,
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

    if(newContactDetails.martialStatus != "") 
        data.familystatuscode = newContactDetails.martialStatus

    if(newContactDetails.ethnicOrigin != "") 
        data.pobl_ethnicorigin = newContactDetails.ethnicOrigin

    if(newContactDetails.sexualOrientation != "") 
        data.pobl_sexualorientation = newContactDetails.sexualOrientation
    
    if(newContactDetails.economicStatus != "") 
        data.pobl_economicstatus = newContactDetails.economicStatus
    
    if(newContactDetails.language != "") 
        data.pobl_language = newContactDetails.language

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

module.exports = {
    GetAllContacts,
    GetContactByID, 
    UpdateContact
}
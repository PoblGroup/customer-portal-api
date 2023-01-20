const axios = require('axios')

const GetAllCases = async (token, contactId) => {
    let cases = {
        complaints: [],
        compliments: [],
        asbs: [],
        generalEnquiries: [],
        tenancyEnds: [],
        permissionRequests: []
    };

    cases.complaints = await GetComplaints(token, contactId)
    cases.compliments = await GetCompliments(token, contactId)
    cases.asbs = await GetAsbs(token, contactId)
    cases.generalEnquiries = await GetGeneralEnquries(token, contactId)
    cases.tenancyEnds = await GetEndTenancies(token, contactId)
    cases.permissionRequests = await GetPermissionRequests(token, contactId)

    return cases
}

const GetComplaints = async (token, contactId) => {
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_complaints?$select=pobl_complaintref,createdon,pobl_natureofcomplaint,pobl_dateclosed`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const NewComplaint = async (token, newComplaint) => {
    let created = false

    var data = {
        pobl_natureofcomplaint: newComplaint.detail,
        pobl_reporttype: newComplaint.type,
        pobl_source: '771570000',
        "pobl_Contact@odata.bind": "/contacts(" + newComplaint.contactId + ")",
        "pobl_Account@odata.bind": "/accounts(" + newComplaint.accountId + ")" 
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_complaints`,
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

const GetCompliments = async (token, contactId) => {
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_compliments?$select=pobl_complimentref,createdon,pobl_natureofcompliment`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const NewCompliment = async (token, newCompliment) => {
    let created = false

    var data = {
        pobl_complimentcategory: newCompliment.category,
        pobl_complimentcategoryother: newCompliment.categoryOther,
        pobl_natureofcompliment: newCompliment.detail,
        pobl_source: '771570000',
        pobl_reporteddate: newCompliment.reportedDate,
        "pobl_Account@odata.bind": "/accounts(" + newCompliment.accountId + ")" 
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_compliments`,
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

const GetAsbs = async (token, contactId) => {
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_asbcases?$select=pobl_asbref,createdon,pobl_initialincidentdescription,pobl_location,pobl_asbclosurereason,pobl_caseoutcome,pobl_dateclosed`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const NewAsb = async (token, newAsb) => {
    let created = false

    var data = {
        pobl_pobltenant: newAsb.poblTenant,
        "pobl_MainCategory@odata.bind": "/pobl_asbmaincategories("+ newAsb.mainCategory +")",
        "pobl_SubCategory@odata.bind": "/pobl_asbsubcategories("+ newAsb.subCategory +")",
        pobl_dateofincident: newAsb.dateOfIncident,
        pobl_source: '771570000',
        pobl_location: newAsb.location,
        pobl_initialincidentdescription: newAsb.detail,
        pobl_policecontacted: newAsb.policeContacted,
        pobl_lognichenumber: newAsb.logNicheNumber,
        "pobl_Complainant@odata.bind": "/contacts("+ newAsb.complainant +")",
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_asbcases`,
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

// TODO: May need to create our own entity in Dynamics
const GetGeneralEnquries = async (token, contactId) => {
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/adx_portalcomments?$select=subject,description,createdon`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const NewGeneralEnquiry = async (token, newGeneralEnquiry) => {
    let created = false

    var data = {
        pobl_type: newGeneralEnquiry.type,
        subject: newGeneralEnquiry.subject,
        description: newGeneralEnquiry.description,
        "regardingobjectid_contact@odata.bind": "/contacts("+ newGeneralEnquiry.contactId +")",
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/adx_portalcomments`,
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

const GetEndTenancies = async (token, contactId) => {
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_noticeofexitrequests?$select=pobl_requestref,createdon,pobl_requestdate,pobl_requestreason,pobl_requestdetail`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const NewTenancyEnd = async (token, newTenancyEnd) => {
    let created = false

    var data = {
        pobl_requestreason: newTenancyEnd.requestReason,
        pobl_requestother: newTenancyEnd.requestOther,
        pobl_requestdetail: newTenancyEnd.detail,
        pobl_requestdate: newTenancyEnd.requestDate,
        pobl_source: '771570001',
        "pobl_Account@odata.bind": "/accounts("+ newTenancyEnd.accountId +")",
        "pobl_Contract@odata.bind": "/pobl_occupancycontracts("+ newTenancyEnd.contractId +")",
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_noticeofexitrequests`,
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
            console.log(error)
            created = false
        });

    return created
}

const GetPermissionRequests = async (token, contactId) => {
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_permissionrequests?$select=pobl_requestref,createdon,pobl_name,pobl_requesttype,pobl_requestother,pobl_requestdetail,pobl_resolutiondate,pobl_resolutionnotes`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const NewPermissionRequest = async (token, newPermissionRequest) => {
    let created = false

    var data = {
        pobl_requesttype: newPermissionRequest.requestType,
        pobl_requestother: newPermissionRequest.requestOther,
        pobl_requestdetail: newPermissionRequest.detail,
        pobl_requestdate: newPermissionRequest.requestDate,
        pobl_source: '771570001',
        "pobl_Account@odata.bind": "/accounts("+ newPermissionRequest.accountId +")",
        "pobl_Contract@odata.bind": "/pobl_occupancycontracts("+ newPermissionRequest.contractId +")",
        "pobl_Contact@odata.bind": "/contacts("+ newPermissionRequest.contactId +")",
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_permissionrequests`,
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
            console.log(error)
            created = false
        });

    return created
}

module.exports = {
    GetAllCases,
    NewComplaint,
    NewCompliment,
    NewAsb,
    NewTenancyEnd,
    NewPermissionRequest,
    NewGeneralEnquiry,
}
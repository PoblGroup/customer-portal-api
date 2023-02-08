const { default: axios } = require("axios");
const { maintenanceTemplates, templateJobs, propertyCode, projectCode, contractorInfo, flowSettings, maintJobSingle, appointmentOutcome } = require("../utils/queries");

const GetMaintenanceCases = async (token, accountId) => {
    let data = null;
    const fields = [
        '_pobl_maintjobaccountid_value',
        'createdon',
        'pobl_maintcasenote',
        'pobl_maintcaseref',
        'modifiedon',
        '_pobl_maintcasepropertyid_value',
        'pobl_name',
        'pobl_maintcaseid'
    ]

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_maintcases?$select=${fields.join(',')}&$filter=_pobl_maintjobaccountid_value eq '${accountId}' and statecode eq 0`,
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

const GetMaintenanceCase = async (token, id) => {
    let data = null;
    // const fields = [
    //     '_pobl_maintjobaccountid_value',
    //     'createdon',
    //     'pobl_maintcasenote',
    //     'pobl_maintcaseref',
    //     'modifiedon',
    //     '_pobl_maintcasepropertyid_value',
    //     'pobl_name',
    //     'pobl_maintcaseid'
    // ]

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_maintcases(${id})`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    return data;
}

const CreateMaintenanceCase = async (token, accountId, propertyId) => {
    let created = null

    var data = {
        "pobl_MaintCaseAccountID@odata.bind": "/accounts("+ accountId +")",
        "pobl_MaintCasePropertyID@odata.bind": "/pobl_properties(" + propertyId + ")",
        "pobl_maintcasestarteddate": new Date().toISOString(),
        "pobl_maintcasesource": "771570001",
        "pobl_maintcaseservicecharged": false,
        "pobl_maintcaserecharge": false,
        "pobl_createjob": true,
        "pobl_maintcasenote": "Created from Portal",
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_maintcases`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    await axios(config)
        .then(function (response) {
            if (response.status == 204) {
                let createdLocation = response.headers.location
                let maintCaseId = createdLocation.substring(createdLocation.indexOf( '(' ) + 1, createdLocation.indexOf( ')' ))
                created = {
                    created: true,
                    maintCaseId
                }
            }
        })
        .catch(function (error) {
            // console.log(error.response.status, error.response.statusText);
            created = null
        });

    return created
}

const UpdateMaintenanceCase = async (token, caseId, newData) => {
    let updated = false
    let data = {}

    if (newData.workTypeId)
        data["pobl_MaintWorkType@odata.bind"] = "/pobl_maintworktypes("+ newData.workTypeId +")"

    var config = {
        method: "patch",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_maintcases(${caseId})`,
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

const GetMaintenanceTemplates = async (token, location, item) => {
    let data = [];
    let templates = []
    let fetchxml = maintenanceTemplates(item)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_mainttemplatecases?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            templates = response.data.value
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    templates.map((item) => {
        let locations = item.pobl_locationinhome.split(',').filter(x => x == location)
        if(locations.length > 0)
            data.push(item)
    })

    return data;
}

const GetSingleTemplate = async (token, id) => {
    let data = null;

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_mainttemplatecases(${id})`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    return data;
}

const GetTemplateJobs = async (token, templateId) => {
    let data = [];
    let result = []
    let fetchxml = templateJobs(templateId)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_mainttemplatecases?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            result = response.data.value[0]
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    // Check if there is a value for each development - if there is add to data array
    if(result['jobelement1Link.productid'] && result.pobl_jobelement1qty) 
        data.push({ id: result['jobelement1Link.productid'], qty: result.pobl_jobelement1qty })

    if(result['jobelement2Link.productid'] && result.pobl_jobelement2qty) 
        data.push({ id: result['jobelement2Link.productid'], qty: result.pobl_jobelement2qty })

    if(result['jobelement3Link.productid'] && result.pobl_jobelement3qty) 
        data.push({ id: result['jobelement3Link.productid'], qty: result.pobl_jobelement3qty })

    if(result['jobelement4Link.productid'] && result.pobl_jobelement4qty) 
        data.push({ id: result['jobelement4Link.productid'], qty: result.pobl_jobelement4qty })

    if(result['jobelement5Link.productid'] && result.pobl_jobelement5qty) 
        data.push({ id: result['jobelement5Link.productid'], qty: result.pobl_jobelement5qty })

    if(result['jobelement6Link.productid'] && result.pobl_jobelement6qty) 
        data.push({ id: result['jobelement6Link.productid'], qty: result.pobl_jobelement6qty })

    if(result['jobelement7Link.productid'] && result.pobl_jobelement7qty) 
        data.push({ id: result['jobelement7Link.productid'], qty: result.pobl_jobelement7qty })

    if(result['jobelement8Link.productid'] && result.pobl_jobelement8qty) 
        data.push({ id: result['jobelement8Link.productid'], qty: result.pobl_jobelement8qty })

    if(result['jobelement9Link.productid'] && result.pobl_jobelement9qty) 
        data.push({ id: result['jobelement9Link.productid'], qty: result.pobl_jobelement9qty })

    if(result['jobelement10Link.productid'] && result.pobl_jobelement10qty) 
        data.push({ id: result['jobelement10Link.productid'], qty: result.pobl_jobelement10qty })

    return data;
}

const GetProjectCode = async (token, propertyId) => {
    let data
    let financeCode
    let propFetchXml = propertyCode(propertyId)
    let propEncoded = encodeURI(propFetchXml)
    
    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_properties?fetchXml=${propEncoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            financeCode = response.data.value[0]['schemeLink.pobl_financecode']
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    if(financeCode) {
        let projectFetchXml = projectCode(financeCode)
        let projectEncoded = encodeURI(projectFetchXml)

        var config = {
            method: "get",
            url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_chartofcodeses?fetchXml=${projectEncoded}`,
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        };
    
        await axios(config)
            .then(function (response) {
                data = response.data.value[0]. pobl_chartofcodesid
            })
            .catch(function (error) {
                console.log(error.response.status);
            });
    }

    return data;
}

const GetContractor = async (token, contractId) => {
    let data
    let fetchXml = contractorInfo(contractId)
    let encoded = encodeURI(fetchXml)
    
    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/entitlements?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value[0]
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    return data;
}

const CreateMaintenanceJob = async (token, newJob) => {
    let created = null

    var data = {
        "customerid_account@odata.bind": "/accounts("+ newJob.accountId +")",
        "pobl_ActivityCode@odata.bind": "/pobl_chartofactivitieses("+ newJob.activityCodeId +")",
        "pobl_MaintenanceCaseId@odata.bind": "/pobl_maintcases("+ newJob.caseId +")",
        "pobl_Contract@odata.bind": "/entitlements("+ newJob.contractId +")",
        "pobl_Supplier@odata.bind": "/competitors("+ newJob.supplierId +")",
        "pricelevelid@odata.bind": "/pricelevels("+ newJob.priceListId +")",
        "pobl_ProjectCodeId@odata.bind": "/pobl_chartofcodeses("+ newJob.projectCodeId +")",
        "pobl_CostCentre@odata.bind": "/pobl_costcentres("+ newJob.costCentreId +")",
        "description": newJob.description,
        "pobl_PropertyId@odata.bind": "/pobl_properties("+ newJob.propertyId +")",
        "pobl_triggersubmissionapproval": newJob.triggersubmissionapproval,
        "pobl_VATCodeID@odata.bind": "/pobl_vatcodes("+ newJob.vatCodeId +")",
        "pobl_MaintenanceWorkTypeId@odata.bind": "/pobl_maintworktypes("+ newJob.workTypeId +")",
        "pobl_usediagnostics": newJob.usediagnostics,
        "pobl_accessdetails": newJob.accessDetails,
        "pobl_priority": 771570000
      };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/salesorders`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    await axios(config)
        .then(function (response) {
            if (response.status == 204) {
                let createdLocation = response.headers.location
                let maintJobId = createdLocation.substring(createdLocation.indexOf( '(' ) + 1, createdLocation.indexOf( ')' ))
                created = {
                    created: true,
                    maintJobId
                }
            }
        })
        .catch(function (error) {
            console.log(error.response.status, error.response.statusText);
            created = null
        });

    return created
}

const GetFlowSettings = async (token, flowname) => {
    let data = [];
    let fetchxml = flowSettings(flowname)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_settingsregisters?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value[0]
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    return data;
}

const RunFlow = async (flowUrl, data) => {
    let result = null

    var config = {
        method: "post",
        url: flowUrl,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
    };

    await axios(config)
        .then(function (response) {
            result = { data: response.data }
        })
        .catch(function (error) {
            console.log(error.response.status, error.response.statusText);
            result = { error: true }
        });

    return result
}

const GetMaintenanceJob = async (token, jobId) => {
    let data = [];
    let fetchxml = maintJobSingle(jobId)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/salesorders?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value[0]
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    return data;
}

const ServiceConnectToken = async () => {
    let token = null;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("username", process.env.SERVICE_CONNECT_USERNAME);
    urlencoded.append("password", process.env.SERVICE_CONNECT_PASSWORD);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    await fetch("https://connect-api.totalmobile-cloud.com/ws-api/Token", requestOptions)
        .then(response => response.json())
        .then(result => token = `Bearer ${result.access_token}`)
        .catch(error => console.log('error', error))

    return token;
}

const GetServiceConnectAppointments = async (token, orderNumber) => {
    let availability = null;
    var slots = [];
    const url = `${process.env.SERVICE_CONNECT_AVAILABILITY_URI}?PrimaryOrderNumber=${orderNumber}&NumberOfWeeks=5`;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);
    myHeaders.append("Accept", "application/json; version=3");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    await fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => availability = result)
        .catch(error => console.log('error', error));
    
    // console.log('API', availability)

    availability.AvailabilityPlanningWindows.map(item => {
        let day = null;
        let planningWindowId = item.PlanningWindowId
        item.AvailabilityDays.map(d => {
            if(d.AvailabilityStatus != 0) {
                day = {
                    planningWindowId: planningWindowId,
                    date: d.Date,
                    status: d.AvailabilityStatus
                }
                var slotInfo = availability.PlanningWindows.filter(w => w.Id === planningWindowId);
                day.name = slotInfo[0].Name;
                day.start = AvailabilityTimesFix(slotInfo[0].StartHour, slotInfo[0].StartMinute);
                day.end = AvailabilityTimesFix(slotInfo[0].EndHour, slotInfo[0].EndMinute);
                slots.push(day);
            }
        })
    })

    return slots

    // var groupedSlots = _.groupBy(slots, s => s.date)
    // var slotCollection = Object.entries(groupedSlots)
    
    // return slotCollection;
}

const CreateBookingServiceConnect = async (orderNumber, booking, token) => {
    let data = null; 

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json; version=3");
    myHeaders.append("Authorization", token);

    var selectedAppointment = JSON.stringify({
        "PrimaryOrderNumber": orderNumber,
        "Date": booking.Date,
        "PlanningWindowId": booking.PlanningWinId
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: selectedAppointment,
        redirect: 'follow'
    };

    fetch("https://connect-api.totalmobile-cloud.com/ws-api/api/Booking", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.VisitExternalId) {
                data = result
                // CreateDynamicsAppointment(result);
            } else {
                console.error("Failed to book appointment!")
                data = { error: "Failed to book appointment!" }
            }
        })
        .catch(error => console.log('error', error));
    
    return data
}

const GetAppointmentOutcome = async (token, value) => {
    let data
    let fetchXml = appointmentOutcome(value)
    let encoded = encodeURI(fetchXml)
    
    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_maintjobappointmentoutcomes?fetchXml=${encoded}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data.value[0]
        })
        .catch(function (error) {
            console.log(error.response.status);
        });

    const result = {
        id: data.pobl_maintjobappointmentoutcomeid,
        name: data.pobl_name
    }

    return result;
}

const CreateBookingDynamics = async (token, booking, bookingSubmission, apptOutcome) => {
    let created = null

    var data = {
        "pobl_OrderId@odata.bind": "/salesorders(" + salesOrderId +")",
        "pobl_appointmentdateandtime": new Date(booking.Date).toISOString(),
        "pobl_appointmentsource": 771570001,
        "pobl_jobappointmentnote": `${bookingSubmission.date} at ${bookingSubmission.slot}`,
        "pobl_externalreference": booking.VisitExternalId,
        "pobl_AppointmentOutcomeID@odata.bind": "/pobl_maintjobappointmentoutcomes(" + apptOutcome[0].id + ")"
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_maintcases`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    await axios(config)
        .then(function (response) {
            if (response.status == 204) {
                let createdLocation = response.headers.location
                let maintCaseId = createdLocation.substring(createdLocation.indexOf( '(' ) + 1, createdLocation.indexOf( ')' ))
                created = {
                    created: true,
                    maintCaseId
                }
            }
        })
        .catch(function (error) {
            // console.log(error.response.status, error.response.statusText);
            created = null
        });

    return created
}

module.exports = {
    GetMaintenanceCases,
    CreateMaintenanceCase,
    GetMaintenanceTemplates,
    GetSingleTemplate,
    GetTemplateJobs,
    GetMaintenanceCase,
    GetProjectCode,
    GetContractor,
    UpdateMaintenanceCase,
    CreateMaintenanceJob,
    GetFlowSettings,
    RunFlow,
    GetMaintenanceJob,
    ServiceConnectToken,
    GetServiceConnectAppointments,
    CreateBookingServiceConnect,
    GetAppointmentOutcome,
    CreateBookingDynamics,
}
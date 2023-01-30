const axios = require('axios');
const { occupiersResponsible, occupiersAdditional } = require('../utils/queries');

const GetTenantOccupancies = async (token, accountId) => {
    let data = []
    const fields = [
        'pobl_occupancycontractid',
        'pobl_name',
        'pobl_occupancycontractreference',
        'pobl_occupantcontractstartdate',
        'pobl_occupantcontractenddate',
        'pobl_contractbalance',
        '_pobl_debitfrequencyid_value',
        'pobl_nextdebitcycledate',
        '_pobl_accountid_value',
        'statecode',
        '_pobl_propertyreferenceid_value',
        'pobl_occupancycontracttype'
    ]

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_occupancycontracts?$select=${fields.join(',')}&$filter=_pobl_accountid_value eq '${accountId}' and statecode eq 0`,
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

const GetSingleOccupancy = async (token, occupancyId) => {
    let data = []
    const fields = [
        'pobl_occupancycontractid',
        'pobl_name',
        'pobl_occupancycontractreference',
        'pobl_occupantcontractstartdate',
        'pobl_occupantcontractenddate',
        'pobl_contractbalance',
        '_pobl_debitfrequencyid_value',
        'pobl_nextdebitcycledate',
        '_pobl_accountid_value',
        'statecode',
        '_pobl_propertyreferenceid_value',
        'pobl_occupancycontracttype'
    ]

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_occupancycontracts(${occupancyId})?$select=${fields.join(',')}`,
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
            console.log(error);
        });

    return data;
}

const GetOccupiersResponsible = async (token, id) => {
    let data = null;
    let fetchxml = occupiersResponsible(id)
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

const GetOccupiersAdditional = async (token, id) => {
    let data = null;
    let fetchxml = occupiersAdditional(id)
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
    GetTenantOccupancies,
    GetSingleOccupancy,
    GetOccupiersResponsible,
    GetOccupiersAdditional
}
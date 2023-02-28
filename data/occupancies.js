const axios = require('axios');
const { occupiersResponsible, occupiersAdditional, singleOccupancy, getAccountOccupancies } = require('../utils/queries');

const GetTenantOccupancies = async (token, accountId) => {
    let data = []
    let fetchxml = getAccountOccupancies(accountId)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_occupancycontracts?fetchXml=${encoded}`,
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
    let fetchxml = singleOccupancy(occupancyId)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_occupancycontracts?fetchXml=${encoded}`,
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
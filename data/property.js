const axios = require('axios');
const { GetOptionSetLabel } = require('../utils/optionSets');
const { GetPropertyCertificates } = require('./certificate');
const { GetPropteryHazards } = require('./hazards');

const GetSingleProperty = async(token, propertyId) => {
    let data = []
    const fields = [
        'pobl_addressconcat',
        'pobl_buildingtype',
        'pobl_propertytype',
        'pobl_tenuretype',
        'pobl_accommodationtype',
        'pobl_propertyid',
        'pobl_riskasbestos',
        'pobl_lastasbestosinspection',
        'pobl_asbestosconfirmed',
        'pobl_riskfirechoice',
        'pobl_lastfireinspection',
        'pobl_nextfireinspection',
        'pobl_riskelectrical',
        'pobl_lastelectricaltest',
        'pobl_nextelectricaltest',
        'pobl_riskgas',
        'pobl_lastgascertificate',
        'pobl_nextgascertificate',
        'pobl_risklegionellachoice',
        'pobl_lastlegionellatest',
        'pobl_nextlegionellatest'
    ]

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_properties(${propertyId})?$select=${fields.join(',')}`,
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

    // Get Option Set Values
    data.pobl_propertytype = await GetOptionSetLabel(token, 'pobl_propertytype', data.pobl_propertytype.toString())
    data.pobl_buildingtype = await GetOptionSetLabel(token, 'pobl_buildingtype', data.pobl_buildingtype.toString())
    data.pobl_tenuretype = await GetOptionSetLabel(token, 'pobl_tenuretype', data.pobl_tenuretype.toString())
    data.pobl_accommodationtype = await GetOptionSetLabel(token, 'pobl_accommodationtype', data.pobl_accommodationtype.toString())
    data.pobl_riskasbestos = await GetOptionSetLabel(token, 'pobl_propertyrisk', data.pobl_riskasbestos.toString())

    // Get Hazards
    data.hazards = await GetPropteryHazards(token, propertyId)

    // Get Certificates
    data.certificates = await GetPropertyCertificates(token, propertyId)

    return data;
}

const GetPropertyCompliance = async(token, propertyId) => {
    let data = []
    const fields = [
        'pobl_propertyid',
        'pobl_riskasbestos',
        'pobl_lastasbestosinspection',
        'pobl_asbestosconfirmed',
        'pobl_riskfirechoice',
        'pobl_lastfireinspection',
        'pobl_nextfireinspection',
        'pobl_riskelectrical',
        'pobl_lastelectricaltest',
        'pobl_nextelectricaltest',
        'pobl_riskgas',
        'pobl_lastgascertificate',
        'pobl_nextgascertificate',
        'pobl_risklegionellachoice',
        'pobl_lastlegionellatest',
        'pobl_nextlegionellatest'
    ]

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_properties(${propertyId})?$select=${fields.join(',')}`,
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

    if(data.pobl_riskasbestos != null)
        data.pobl_riskasbestos = await GetOptionSetLabel(token, 'pobl_propertyrisk', data.pobl_riskasbestos.toString())

    return data;
}

module.exports = {
    GetSingleProperty,
    GetPropertyCompliance
}
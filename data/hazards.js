const axios = require('axios');
const { propertyHazards } = require('../utils/queries');

const GetPropteryHazards = async (token, id) => {
    let data = null;
    let fetchxml = propertyHazards(id)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_hazards?fetchXml=${encoded}`,
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
    GetPropteryHazards
}
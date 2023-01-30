const { default: axios } = require("axios");
const { adhocCharges, recurringCharges } = require("../utils/queries");

const GetAdHocCharges = async (token, id) => {
    let data = null;
    let fetchxml = adhocCharges(id)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_adhoccharges?fetchXml=${encoded}`,
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

const GetRecurringCharges = async (token, id) => {
    let data = null;
    let fetchxml = recurringCharges(id)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_recurringcharges?fetchXml=${encoded}`,
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
    GetAdHocCharges,
    GetRecurringCharges
}
const { default: axios } = require("axios");
const { periodTransactions } = require("../utils/queries");

const GetPeriodSummaries = async (token, id, start, end) => {
    let data = null;
    let fetchxml = periodTransactions(id)
    let encoded = encodeURI(fetchxml)

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_debitperiodsummaries?fetchXml=${encoded}`,
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
    GetPeriodSummaries
}
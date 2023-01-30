const axios = require('axios');

const GetOptionSets = async(token, entity, value) => {
    let options = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/GlobalOptionSetDefinitions(Name='${entity}')`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            response.data.Options.map(o => {
                var option = {
                    value: o.Value,
                    label: o.Label.UserLocalizedLabel.Label
                }
                options.push(option)
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    let filteredOption = options.filter(item => item.value == value)[0]
    return filteredOption.label
    // return options;
}

module.exports = {
    GetOptionSets
}
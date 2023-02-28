const axios = require('axios');

const GetOptionSets = async(token, entity, value, global = false, multi = false) => {
    let d365Options = []
    let options = []

    // var config = {
    //     method: "get",
    //     url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/GlobalOptionSetDefinitions(Name='${entity}')`,
    //     headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //     },
    // };

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/EntityDefinitions(LogicalName='${entity}')/Attributes/Microsoft.Dynamics.CRM.${multi ? 'MultiSelectPicklistAttributeMetadata' : 'PicklistAttributeMetadata'}?$select=LogicalName&$filter=LogicalName eq '${value}'&$expand=OptionSet,GlobalOptionSet`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            if(global) {
                response.data.value.map(item => {
                    d365Options.push({items:item.GlobalOptionSet.Options})
                }) 
            } else {
                response.data.value.map(item => {
                    d365Options.push({items:item.OptionSet.Options})
                }) 
            }
            // response.data.Options.map(o => {
            //     var option = {
            //         value: o.Value,
            //         label: o.Label.UserLocalizedLabel.Label
            //     }
            //     options.push(option)
            // })
        })
        .catch(function (error) {
            console.log(error);
        });

    // let filteredOption = options.filter(item => item.value == value)[0]
    // return filteredOption.label
    
    if(d365Options.length > 0) {
        d365Options[0].items.map(item => {
            options.push({
                value: item.Value,
                label: item.Label.UserLocalizedLabel.Label
            })
        })
    }

    return options;
}

const GetOptionSetLabel = async(token, entity, value) => {
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
            console.log(response.data)
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
}

module.exports = {
    GetOptionSets,
    GetOptionSetLabel
}
const axios = require('axios')
const bcrypt = require("bcryptjs")

const GetUsers = async (token) => {
    const fields = ['pobl_portaluserid', 'pobl_name', 'pobl_email', 'pobl_username', 'pobl_password']
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_portalusers?$select=${fields.join(',')}`,
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

const GetSingleUser = async (token, id) => {
    const fields = ['pobl_portaluserid','pobl_name','pobl_email', 'pobl_username', 'pobl_password']
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_portalusers(${id})?$select=${fields.join(',')}`,
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    };

    await axios(config)
        .then(function (response) {
            data = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

const GetUserByEmail = async (token, email) => {
    const fields = ['pobl_portaluserid','pobl_name','pobl_email', 'pobl_username', 'pobl_password']
    let data = []

    var config = {
        method: "get",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_portalusers?$select=${fields.join(',')}&$filter=pobl_email eq '${email}'`,
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

const CreateUser = async (token, newUser) => {
    let created = false

    // Hashing password
    const salt = await bcrypt.genSalt(10)
    let pwd = await bcrypt.hash(newUser.password, salt)

    var data = {
        pobl_name: `${newUser.firstname} ${newUser.lastname}`,
        pobl_email: newUser.email,
        pobl_username: newUser.username,
        pobl_password: pwd,
        "pobl_Contact@odata.bind": "/contacts(" + newUser.contactId + ")",
        "pobl_Account@odata.bind": "/accounts(" + newUser.accountId + ")"
    };

    var config = {
        method: "post",
        url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_portalusers`,
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

const matchPassword = async (enteredPassword, userPassword) => {
    return await bcrypt.compare(enteredPassword, userPassword);
}

module.exports = {
    GetUsers,
    GetSingleUser,
    GetUserByEmail,
    CreateUser, 
    matchPassword
}
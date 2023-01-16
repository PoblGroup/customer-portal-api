const axios = require ("axios")
const qs = require ("qs");

async function GetDynamicsToken() {
  let tokenData = null;
  var data = qs.stringify({
    client_id: process.env.DYNAMICS_CLIENT_ID,
    client_secret: process.env.DYNAMICS_CLIENT_SECRET,
    grant_type: "client_credentials",
    resource: `https://${process.env.DYNAMICS_ENV}.crm11.dynamics.com`,
  });
  var config = {
    method: "get",
    url: "https://login.microsoftonline.com/5f0d9160-6b93-41c6-8db2-153e0d7f7960/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:
        "fpc=Ao6FWL31ryRKh_UqGTpFn-uxuI2VAQAAAJr5NtkOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      tokenData = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return tokenData;
}

module.exports = { GetDynamicsToken };

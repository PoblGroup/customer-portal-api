const getAccounts = async (req, res) => {
    res.send('All Accounts')
}

const getSingleAccount = async (req, res) => {
    res.send('Single Account')
}

const updateAccount = async (req, res) => {
    res.send('Update Account')
}

const newAccount = async (req, res) => {
    res.send('New Account')
}

const removeAccount = async (req, res) => {
    res.send('Remove Account')
}


module.exports = {
    getAccounts,
    getSingleAccount,
    updateAccount,
    newAccount,
    removeAccount,
}
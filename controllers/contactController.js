const getContacts = async (req, res) => {
    res.send('All Contacts')
}

const getSingleContact = async (req, res) => {
    res.send('Single Contact')
}

const updateContact = async (req, res) => {
    res.send('Update Contact')
}

const newContact = async (req, res) => {
    res.send('New Contact')
}

const removeContact = async (req, res) => {
    res.send('Remove Contact')
}


module.exports = {
    getContacts,
    getSingleContact,
    updateContact,
    newContact,
    removeContact,
}
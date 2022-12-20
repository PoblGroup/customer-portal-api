const getProperties = async (req, res) => {
    res.send('All Properties')
}

const getSingleProperty = async (req, res) => {
    res.send('Single Property')
}

const updateProperty = async (req, res) => {
    res.send('Update Property')
}

const newProperty = async (req, res) => {
    res.send('New Property')
}

const removeProperty = async (req, res) => {
    res.send('Remove Property')
}


module.exports = {
    getProperties,
    getSingleProperty,
    updateProperty,
    newProperty,
    removeProperty,
}
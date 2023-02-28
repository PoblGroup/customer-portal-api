const { GetSingleProperty, GetPropertyCompliance } = require("../data/property")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")

const getProperties = async (req, res) => {
    res.send('All Properties')
}

const getSingleProperty = async (req, res) => {
    const { id } = req.params
    const { access_token } = await GetDynamicsToken()

    try {
        let property = await GetSingleProperty(access_token, id)

        if(property) {
            res.status(200).json(property)
        } else {
            res.status(404).json({ error: 'No Property Found' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
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

const getPropertyCompliance = async (req, res) => {
    const { id } = req.params
    const { access_token } = await GetDynamicsToken()

    try {
        let compliance = await GetPropertyCompliance(access_token, id)

        if(compliance) {
            res.status(200).json(compliance)
        } else {
            res.status(404).json({ error: 'No Compliance Information Found' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' })
    }    
}


module.exports = {
    getProperties,
    getSingleProperty,
    updateProperty,
    newProperty,
    removeProperty,
    getPropertyCompliance
}
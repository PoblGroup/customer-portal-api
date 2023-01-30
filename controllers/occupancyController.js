const { GetTenantOccupancies, GetSingleOccupancy, GetOccupiersAdditional, GetOccupiersResponsible } = require("../data/occupancies")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")

// Get all customer tenancies based on the account id
const getOccupancies = async (req, res) => {
    const { id } = req.query
    const { access_token } = await GetDynamicsToken()

    try {
        let occupancies = await GetTenantOccupancies(access_token, id)
        res.status(200).json(occupancies)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

const getSingleOccupancy = async (req, res) => {
    const { id } = req.params
    const { access_token } = await GetDynamicsToken()

    try {
        let occupancy = await GetSingleOccupancy(access_token, id)

        if(occupancy) {
            occupancy.responsible = await GetOccupiersResponsible(access_token, occupancy.pobl_occupancycontractid)
            occupancy.additional = await GetOccupiersAdditional(access_token, occupancy.pobl_occupancycontractid)
            res.status(200).json(occupancy)
        } else {
            res.status(404).json({ error: 'No Occupancy Found' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

const updateOccupancy = async (req, res) => {
    res.send('Update Occupancy')
}

const newOccupancy = async (req, res) => {
    res.send('New Occupancy')
}

const removeOccupancy = async (req, res) => {
    res.send('Remove Occupancy')
}


module.exports = {
    getOccupancies,
    getSingleOccupancy,
    updateOccupancy,
    newOccupancy,
    removeOccupancy,
}
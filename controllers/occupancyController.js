const getOccupancies = async (req, res) => {
    res.send('All Occupancys')
}

const getSingleOccupancy = async (req, res) => {
    res.send('Single Occupancy')
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
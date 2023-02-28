const { GetAdHocCharges, GetRecurringCharges } = require("../data/charges")
const { GetTenantOccupancies, GetSingleOccupancy, GetOccupiersAdditional, GetOccupiersResponsible } = require("../data/occupancies")
const { GetPeriodSummaries } = require("../data/periodSummary")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")
const { GetOptionSets, GetOptionSetLabel } = require("../utils/optionSets")

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
            occupancy['property.pobl_accommodationtype'] = await GetOptionSetLabel(access_token, 'pobl_accommodationtype', occupancy['property.pobl_accommodationtype'])
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

const getTransactions = async (req, res) => {
    const { id } = req.params
    const { access_token } = await GetDynamicsToken()

    let o365Trans = [
        { pobl_debitperiodsummaryid: 'fb85e7fe-e856-ed11-9562-0022481b5dcb', periodstartdate: '27/06/2022 00:00:00', periodenddate: '03/07/2022 00:00:00', narrative: 'test', value: 10.00, transactionId: 1010 },
        { pobl_debitperiodsummaryid: 'fb85e7fe-e856-ed11-9562-0022481b5dcb', periodstartdate: '27/06/2022 00:00:00', periodenddate: '03/07/2022 00:00:00', narrative: 'test', value: 10.00, transactionId: 2010 },
        { pobl_debitperiodsummaryid: 'fb85e7fe-e856-ed11-9562-0022481b5dcb', periodstartdate: '27/06/2022 00:00:00', periodenddate: '03/07/2022 00:00:00', narrative: 'test', value: 10.00, transactionId: 3010 },
        { pobl_debitperiodsummaryid: 'fb85e7fe-e856-ed11-9562-0022481b5dcb', periodstartdate: '27/06/2022 00:00:00', periodenddate: '03/07/2022 00:00:00', narrative: 'test', value: 10.00, transactionId: 4010 },
        { pobl_debitperiodsummaryid: 'cc63ca81-e256-ed11-9562-0022481b5f13', periodstartdate: '30/05/2022 00:00:00', periodenddate: '26/07/2022 00:00:00', narrative: 'test', value: 10.00, transactionId: 5010 },
        { pobl_debitperiodsummaryid: 'cc63ca81-e256-ed11-9562-0022481b5f13', periodstartdate: '30/05/2022 00:00:00', periodenddate: '26/07/2022 00:00:00', narrative: 'test', value: 10.00, transactionId: 6010 },
    ]

    // try {
    //     let transactions = await GetPeriodSummaries(access_token, id, null, null)
    //     res.status(200).json(transactions)
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({ error: 'Something went wrong' })
    // }

    let trans = []

    let grouped = o365Trans.reduce(function(groups, item) {
        let name = `Period ${item.periodstartdate} - ${item.periodenddate}`
        var group = groups[name] || (groups[name] = []);
        group.push(item);
        return groups;
    }, {});

    for(var key in grouped) { 
        var group = grouped[key];
        trans.push({ period: key, transactions: group })
    }

    res.json(trans)
}

const getCharges = async (req, res) => {
    const { id } = req.params
    const { access_token } = await GetDynamicsToken()

    try {
        let adhoc = await GetAdHocCharges(access_token, id)
        let recurring = await GetRecurringCharges(access_token, id)
        res.status(200).json({ data: {
            adhoc,
            recurring
        }})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
}


module.exports = {
    getOccupancies,
    getSingleOccupancy,
    updateOccupancy,
    newOccupancy,
    removeOccupancy,
    getTransactions,
    getCharges
}
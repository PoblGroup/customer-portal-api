const { FindContact } = require("../data/contact")
const { GetUsers, GetSingleUser, CreateUser, GetUserByEmail, matchPassword } = require("../data/users")
const { GetDynamicsToken } = require("../utils/dynamicsAuth")
const generateToken = require("../utils/generateToken")

const authUser = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { email, password } = req.body

    const user = await GetUserByEmail(access_token, email)

    // include match passsword - additional function
    if(user.length > 0 && (await matchPassword(password, user[0].pobl_password))) {
        res.status(200).json({
            data: {
                id: user[0].pobl_portaluserid,
                username: user[0].pobl_username,
                email: user[0].pobl_email,
                fullname: user[0].pobl_name,
                contactId: user[0].pobl_contact,
                token: generateToken(user[0].id)
            }
        })
    } else {
        res.status(401).json({ error: 'Incorrect login details' })
    }
}

const createUser = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const { firstname, lastname, email, username, password, currentOccupier, dob, nationalInsurance } = req.body

    // Find if user already exists
    const currentUser = await GetUserByEmail(access_token, email)
    if (currentUser.length > 0) {
        return res.status(400).json({ error: "User already exists with this email address" });
    }

    // Find Existing Contact Record
    const contact = await FindContact(access_token, req.body)

    // Check if more than one contact is returned
    if(contact.length > 1)
        return res.status(400).json({ error: 'Too many contacts found with the same details. Please get in touch.' })

    // Check if any contact records are returned
    if(contact.length == 0)
        return res.status(404).json({ error: 'No contact found matching your details. Please get in touch.' })
    
    const user = await CreateUser(access_token, { 
        firstname,
        lastname,
        email,
        username,
        password,
        contactId: contact[0].contactid,
        accountId: contact[0]._pobl_accountid_value
    })

    if (user) {
        res.status(201).json({ message: 'User Added!' });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
}

//TODO: This should be a protected route only accessible my admin
const getUsers = async (req, res) => {
    const { access_token } = await GetDynamicsToken()
    const d365Users = await GetUsers(access_token)
    res.status(200).json({ data: d365Users })
}

const getUser = async (req, res) => {
    const id = req.params.id
    const { access_token } = await GetDynamicsToken()

    const user = await GetSingleUser(access_token, id)
    res.send(user)
}

const updateUser = async (req, res) => {
    res.send('Update User')
}

module.exports = {
    authUser,
    createUser, 
    getUsers, 
    getUser, 
    updateUser
}
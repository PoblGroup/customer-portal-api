const jwt = require('jsonwebtoken')
const users = require('../data/userExample.json')

const protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = users.filter(u => u.id == decoded.id)
            next() 
        } catch (error) {
            console.log(error)
            res.status(401).json({ error: 'Not Authorised - Token Failed'})
        }
    }

    if(!token) {
        res.status(401).json({ error: 'Please provide a token' })
    }
}

module.exports = { protect }

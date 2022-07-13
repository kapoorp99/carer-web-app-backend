const User = require('../models/User.model')

let auth = (req, res, next) => {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) {
            throw err
        }
        console.log(user)
        if (!user) {
            return res.json({
                isAuth: "false",
                error: true
            })
        }
        req.token = token
        req.user = user
        next()
    })
}

module.exports = { auth }
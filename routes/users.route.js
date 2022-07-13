const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth')
const User = require('../models/User.model')

// signup route
router.post('/signup', (req, res) => {
    const newuser = new User(req.body);
    if (newuser.password != newuser.password2) {
        return res.status(400).json({ message: "password not matched!" });
    }
    User.findOne({ email: newuser.email }, function (err, user) {
        if (user) {
            return res.status(400).json({ auth: false, message: "email already exits!" })
        };

        newuser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
            res.status(200).json({
                succes: true,
                user: doc
            });
        });
    });
});

// signin route
router.post('/signin', function (req, res) {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) return res(err);
        if (user) return res.status(400).json({
            error: true,
            message: "You are already logged in"
        });

        else {
            User.findOne({ 'email': req.body.email }, (err, user) => {
                if (!user) return res.json({ isAuth: false, message: ' Auth failed ,email not found!' });

                user.comparepassword(req.body.password, (err, isMatch) => {
                    if (!isMatch) return res.json({ isAuth: false, message: "password doesn't match!" });

                    user.generateToken((err, user) => {
                        if (err) return res.status(400).send(err);
                        res.cookie('auth', user.token).json({
                            isAuth: true,
                            message: "User signed in successfully",
                            id: user._id,
                            email: user.email,
                            token: user.token
                        });
                    });
                });
            });
        }
    });
});

//logout user
router.get('/signout', auth, (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200).json("User Logged out successfully");
    });

});

// get logged in user
router.get('/profile', auth, (req, res) => {
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + " " + req.user.lastname,
        points: req.user.points

    })
});

// get user profile
router.post('/userprofile/:uid', async (req, res) => {
    const user = await User.findById({ _id: req.params.uid })
        .then((userDetails) => {
            res.status(201).json({
                message: "User Profile",
                userDetails: {
                    email: userDetails.email,
                    firstname: userDetails.firstname,
                    lastname: userDetails.lastname,
                    points: userDetails.points,
                    token: userDetails.token,
                    id: userDetails._id
                }
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
});

//add points to user profile
router.patch('/addpoints/:id', async (req, res) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((userDetails) => {
            res.status(201).json({
                message: "Points updated successfully",
                userDetails: userDetails
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

//get user coins
router.post('/getcoins/:id', async (req, res) => {
    const coins = await User.findOne({ _id: req.params.id })
        .then((user) => {
            res.status(200).json({
                points: user.points
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                "error": err
            })
        })
})
module.exports = router
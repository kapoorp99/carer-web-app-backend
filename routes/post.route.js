const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');

//Retrieve list of all the posts
router.get('/all_posts', async (req, res) => {
    const posts_data = await Post.find().exec().then((posts) => {
        const response = {
            total_posts: posts.length,
            posts: posts.map((post) => {
                return ({
                    id: post._id,
                    city: post.city,
                    message: post.message,
                    contact: post.contact,
                    email: post.email,
                    name: post.name,
                    gotHelp: false
                })
            })
        };
        res.status(200).json(response);
    }).catch((error) => {
        res.status(500).json({
            error: error
        });
    })
})

// Retrieve a post on the basis of its id
router.get('/:id', async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id })
        .then((postDetails) => {
            res.status(200).json({
                postDetails: postDetails
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

// Retrieve list of all the posts on the basis of city
router.get('/all_posts/:city', async (req, res) => {
    const posts_data = await Post.find({ city: req.params.city }).exec().then((posts) => {
        const response = {
            total_posts: posts.length,
            posts: posts.map((p) => {
                return ({
                    id: p._id,
                    city: p.city,
                    message: p.message,
                    contact: p.contact,
                    email: p.email,
                    name: p.name,
                    created_at: p.createdAt,
                    gotHelp: p.gotHelp
                })
            })
        };
        res.status(200).json(response);
    }).catch((error) => {
        res.status(500).json({
            error: error
        });
    })
})


// Retrieve list of all the posts on the basis of email
router.get('/all_posts/email/:email', async (req, res) => {
    console.log(req.params.email);
    const posts_data = await Post.find({ email: req.params.email }).exec().then((posts) => {
        const response = {
            total_posts: posts.length,
            user_email: posts.email,
            posts: posts.map((p) => {
                return ({
                    id: p._id,
                    city: p.city,
                    message: p.message,
                    contact: p.contact,
                    email: p.email,
                    name: p.name,
                    gotHelp: false
                })
            })
        };
        res.status(200).json(response);
    }).catch((error) => {
        res.status(500).json({
            error: error
        });
    })
})


// Delete a post
router.delete('/:id', async (req, res) => {
    Post.findOneAndRemove({ _id: req.params.id })
        .then((post) => {
            if (post) {
                return res.status(200).json({
                    message: "Post removed successfully"
                })
            } else {
                return res.status(404).json({
                    message: "Post not found"
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

//Edit a post
router.put('/edit/:id', async (req, res) => {
    const newDetails = {
        city: req.body.city,
        message: req.body.message,
        contact: req.body.contact,
        gotHelp: req.body.gotHelp
    };
    const previousDetails = await Post.findById({ _id: req.params.id })
        .then((details) => {
            temp = details;
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        });
    if (temp !== undefined) {
        if (newDetails.city == null || newDetails.city === "") {
            newDetails.city = temp.city;
        }
        if (newDetails.message == null || newDetails.message === "") {
            newDetails.message = temp.message;
        }
        if (newDetails.contact == null || newDetails.contact === "") {
            newDetails.contact = temp.contact;
        }
    }

    const post = await Post.findByIdAndUpdate({ _id: req.params.id }, newDetails, { new: true })
        .then((postInfo) => {
            res.status(201).json({
                message: "Post updated successfully",
                post: postInfo
            });
        }).catch((error) => {
            res.status(500).json({
                error: error
            })
        });
})


//when needy person got help
router.patch('/gothelp/:id', async (req, res) => {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((postDetails) => {
            res.status(201).json({
                message: "Post updated successfully",
                postDetails: postDetails
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

// Add a post
router.post('/add_post', async (req, res) => {
    const postDetails = {
        city: req.body.city,
        message: req.body.message,
        contact: req.body.contact,
        email: req.body.email,
        name: req.body.name,
        gotHelp: false
    };
    const post = await Post.create(postDetails).then((postInfo) => {
        res.status(201).json({
            message: "Post added successfully",
            post: postInfo
        });
    }).catch((error) => {
        res.status(500).json({
            error: error
        })
    });
})

module.exports = router;
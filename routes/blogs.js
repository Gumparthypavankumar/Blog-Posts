const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Blog model

require('../models/Blog');
const blog = mongoose.model('blogs');

// Blogs Route

router.get('/', ensureAuthenticated ,(req, res) => {
    blog.find({user : req.user.id})
        .sort({ date: -1 })
        .then(blogs => {
            res.render('blogposts/blogs', {
                blogs: blogs
            });
        });
});

// Add Blog get route

router.get('/add', ensureAuthenticated ,(req, res) => {
    res.render('blogposts/add');
});

// Adding the post into the database

router.post('/',ensureAuthenticated, (req, res) => {
    //Validation of inputs
    // res.render('index');
    let errors = [];
    const title = req.body.title;
    const details = req.body.details;
    if (!title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!details) {
        errors.push({ text: 'Please add details' });
    }
    if (errors.length > 0) {
        res.render('blogposts/add', { errors, title, details });
    }
    else {
        const newUser = {
            title: title,
            details: details,
            user:req.user.id
        }
        new blog(newUser).save()
            .then(blog => {
                req.flash('success_msg', 'Added Blog Successfully');
                res.redirect('/blogs')
            });
    }
});

//Edit Route

router.get('/update/:id', ensureAuthenticated ,(req, res) => {
    blog.findOne({
        _id: req.params.id
    })
        .then(blog => { 
            if(blog.user != req.user.id)
            {
                req.flash('error_msg','Not Authorized');
                res.redirect('/blogs');
            }
            else
            {
                res.render('blogposts/edit', { blog });
            }
        })
        .catch(err => console.log(err));
});

//update Route

router.put('/:id', ensureAuthenticated ,(req, res) => {
    blog.updateOne({ _id: req.params.id }, {
        $set: {
            title: req.body.title,
            details: req.body.details
        }
    })
        .then(result => {
            req.flash('success_msg', 'Updated Blog Successfully');
            res.redirect('/blogs')
        })
        .catch(err => console.log(err));
});

// Delete Route

router.delete('/:id', ensureAuthenticated ,(req, res) => {
    blog.deleteOne({ _id: req.params.id })
        .then(result => {
            req.flash('success_msg', 'Blog Removed Successfully');
            res.redirect('/blogs')
        })
        .catch(err => console.log(err));
});


module.exports = router;
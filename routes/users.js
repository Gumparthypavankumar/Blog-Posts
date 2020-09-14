const express = require('express');
const moongose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
// Bringing in Users model
require('../models/User');
const user = moongose.model('users');
// Users Route

//Register Route
router.get('/register', (req, res) => {
   res.render('../views/users/register');
});

//Login Route
router.get('/login', (req, res) => {
   res.render('../views/users/login');
});

// Register Form Post Route

router.post('/register', (req, res) => {
   let errors = [];
   if (req.body.username.length < 4)
      errors.push({ text: 'username should be atleast 4 characters' });
   if (req.body.password < 8)
      errors.push({ text: 'Password should be atleast 8 characters long' });
   if (req.body.password !== req.body.confirmpassword)
      errors.push({ text: 'Passwords Does not match' });
   if (errors.length > 0)
      res.render('../views/users/register', {
         errors: errors,
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
         confirmpassword: req.body.confirmpassword
      });
   else {
      user.findOne({ email: req.body.email })
         .then(userdb => {
            if (userdb) {
               errors.push({ text: 'Email Already Taken' });
               res.render('../views/users/register', {
                  errors: errors,
                  username: req.body.username,
                  email: req.body.email,
                  password: req.body.password,
                  confirmpassword: req.body.confirmpassword
               });
            }
            else {
               const newUser = {
                  username: req.body.username,
                  email: req.body.email,
                  password: req.body.password
               };
               bcrypt.genSalt(10, function (err, salt) {
                  bcrypt.hash(req.body.password, salt, function (err, hash) {
                     // Store hash in your password DB.
                     if (err)
                        throw err;
                     newUser.password = hash;
                     new user(newUser).save()
                        .then(user => {
                           req.flash('success_msg', 'Registered SuccessFully');
                           res.redirect('/blogs')
                        })
                        .catch(err => console.log(err));
                  });
               });
            }
         })

   }
});

// Login Post Route

router.post('/login', (req, res, next) => {
  passport.authenticate('local',{
     successRedirect:'/blogs',
     failureRedirect:'/users/login',
     failureFlash:true
  })(req,res,next);
});

//Logout get Route
router.get('/logout',(req,res)=>{
   req.logout();
   req.flash('success_msg','You are Logout');
   res.redirect('/users/login');
});
module.exports = router;
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

// Load User Model

const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=> {
        User.findOne({email:email})
        .then(user => {
            if(!user)
            {
                return done(null,false,{message:'No User Found'});
            }
            bcrypt.compare(password,user.password,(err,result) => {
                if(err) throw err;
                if(result)
                {
                    return done(null,user);
                }
                else
                {
                    return done(null,false,{message:'password Incorect'});
                }
            });
        })
    }));
    passport.serializeUser((user,done) =>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done) =>{
        User.findById(id,(err,user) => {
         done(err,user);
        });
    });
}
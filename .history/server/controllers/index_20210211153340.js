let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let DB = require('../config/db');
let userModel = require('../models/user');
let User = userModel.User; 





// main pages
module.exports.displayHomePage = (req, res, next) => {
    res.render('index', {title: 'Home', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayAboutPage = (req, res, next) => {
    res.render('index', { title: 'About', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayProductsPage = (req, res, next) => {
    res.render('index', { title: 'Products', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayServicesPage = (req, res, next) => {
    res.render('index', { title: 'Services', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayContactPage = (req, res, next) => {
    res.render('index', { title: 'Contact', displayName: req.user ? req.user.displayName : ''});
}


// login logout
module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if(!req.user)
    {
       /* res.render('auth/login', 
        {
           title: "Login",
           messages: req.flash('loginMessage'),
           displayName: req.user ? req.user.displayName : '' 
        })*/
    }
    else
    {
       // return res.redirect('/');
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
        // Server error?
        if(err)
        {
            return res.json({success: false, msg: 'server error', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }});
        }
        // user login error?
        if(!user)
        {
            return res.json({success: false, msg: 'user or password is not valid', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }});
        }
        req.login(user, (err) => {
            // Server error?
            if(err)
            {
                return res.json({success: false, msg: 'password and username are correct, but server error while logging', user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    email: user.email
                }});
            }

            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.Secret, {
                expiresIn: 604800 // 1 week
            });
            
            return res.json({success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            },token:authToken});

            //return res.redirect('/book-list');
        });
    })(req, res, next);
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    //res.redirect('/');
    res.json({success: true, msg: 'User Successfully Logged out!'});
}



// register
module.exports.displayRegisterPage = (req, res, next) => {
    // check if the user is not already logged in
    if(!req.user)
    {
        /*res.render('admin/register',
        {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });*/
    }
    else
    {
        //return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object from Ngform
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            if(err.name == "UserExistsError")
            {
                return res.json({msg: 'This user already exsist. Please try another.'});
            }
            else
            {
                return res.json({msg: 'User is not duplicate but the registration process failed ..' });
            }
        }
        else
        {
            // if no error exists, then registration is successful
            // redirect the user and authenticate them

            return res.json({msg: 'Registration success! :)'});
            
            /*
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/book-list')
            });
            */
        }
    });
}


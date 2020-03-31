const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/User');

exports.getIsLoggedIn = (req,res,next) => {
    const isLoggedIn = req.session.isLoggedIn;
    if(isLoggedIn){
        next();
    } else {
        res.redirect('/login');
    }
}

exports.getSignUp = (req,res,next) => {
    res.render('auth/signup',{
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: '',
        oldInput: {},
        errors: []
    });
};

exports.postSignUp = (req,res,next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            isLoggedIn: req.session.isLoggedIn,
            errors: errors.array(),
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        })
    }

    bcrypt.hash(password,12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
            })
            return user.save();
        })  
        .then( () => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
};

exports.getSignIn = (req,res,next) => {
    res.render('auth/login',{
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: '',
        errors: [],
        oldInput: {}
    });
};

exports.postSignIn = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('auth/login',{
            isLoggedIn: req.session.isLoggedIn,
            errors: errors.array(),
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            }
        })
    }

    User.findOne({ email: email })
        .then( user => {
            bcrypt.compare(password, user.password)
                .then( doMatch => {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        req.flash('success', 'You Have been Logged In Successfully.');
                        return res.redirect('/dashboard');
                    })
                })
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req,res,next) => {
    req.session.destroy( () => {
        res.redirect('/');
    });
}
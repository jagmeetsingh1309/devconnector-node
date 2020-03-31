const express = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');

const authControllers = require('../controllers/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/signup', authControllers.getSignUp);

router.post(
    '/signup',
    [
        body('name')
        .isLength({min: 6})
        .withMessage('Name should be atleast 6 charachters long.'),
        body('email')
        .isEmail()
        .withMessage('Invalid Email.')
        .custom( (value,{req}) => {
            return User.findOne({ email: value }).then(user => {
                if(user){
                    return Promise.reject('Email Already exists.')
                }
            })
        }),
        body('password')
        .isLength({ min: 8})
        .withMessage('Password should be 8 charachters long.'),
        body('confirmPassword')
        .custom( (value, {req}) => {
            if(value != req.body.password){
                throw new Error('Password does not match.')
            } else {
                return true;
            }
        })
    ], 
    authControllers.postSignUp);

router.get('/login', authControllers.getSignIn);

router.post(
    '/login',
    [
        body('email')
        .custom( (value, {req}) => {
            return User.findOne({ email: value }).then(user => {
                if(!user){
                    return Promise.reject('Invalid E-mail.')
                }
            })
        }),
        body('password')
        .custom( (value,{req}) => {
            return User.findOne({ email: req.body.email}).then(user =>{
                if(user){
                  return bcrypt.compare(value,user.password).then(doMatch => {
                      if(!doMatch){
                          return Promise.reject('Password does not Match.')
                      }
                  })  
                }
            })
        })
    ], 
    authControllers.postSignIn);

router.post('/logout', authControllers.postLogout);

module.exports = router;
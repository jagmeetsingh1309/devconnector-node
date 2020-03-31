const { validationResult } = require('express-validator');

const Education = require('../models/Education');

//working correctly and refined.
exports.getAddEducation = (req,res,next) => {
    res.render('profile/add-education',{
        isLoggedIn: req.session.isLoggedIn,
        errors: [],
        errorMessage: '',
        oldInput: {}
    });
};

//working correctly and refined.
exports.postAddEducation = (req,res,next) => {
    const school = req.body.school;
    const degree = req.body.degree;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const description = req.body.description;
    const userId = req.session.user._id;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('profile/add-education', {
            isLoggedIn: req.session.isLoggedIn,
            errors: errors.array(),
            errorMessage: errors.array()[0].msg,
            oldInput: {
                school: school,
                degree: degree,
                startDate: startDate,
                endDate: endDate,
                description: description,
                userId: userId
            }
        })
    }
    const education = new Education({
        school: school,
        degree: degree,
        startDate: startDate,
        endDate: endDate,
        description: description,
        user: userId
    });

    education
        .save()
        .then( () => {
            req.flash('success', 'Education Added Successfully.');
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
};

exports.postDeleteEducation = (req,res,next) => {
    const educationId = req.body.educationId;
    Education
        .findByIdAndDelete(educationId)
        .then( result => {
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
};
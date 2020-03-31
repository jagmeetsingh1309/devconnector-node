const { validationResult } = require('express-validator');

const Experience = require('../models/Experience');

//working correctly and refined.
exports.getAddExperience = (req,res,next) => {
    res.render('profile/add-experience',{
        isLoggedIn: req.session.isLoggedIn,
        errors: [],
        errorMessage: '',
        oldInput: {}
    });
};

//working correctly and refined.
exports.postAddExperience = (req,res,next) => {
    const title = req.body.title;
    const location = req.body.location;
    const company = req.body.company;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const description = req.body.description;
    const userId = req.session.user._id;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('profile/add-experience',{
            isLoggedIn: req.session.isLoggedIn,
            errors: errors.array(),
            errorMessage: errors.array()[0].msg,
            oldInput: {
                title: title,
                location: location,
                company: company,
                startDate: startDate,
                endDate: endDate,
                description: description,
                userId: userId
            }
        })
    }

    const experience = new Experience({
        title: title,
        company: company,
        location: location,
        startDate: startDate,
        endDate: endDate,
        description: description,
        user: userId
    });
    experience
        .save()
        .then( () => {
            req.flash('success','Experience Added Successfully.');
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
};

exports.postDeleteExperience = (req,res,next) => {
    const experienceId = req.body.experienceId;
    Experience
        .findByIdAndDelete(experienceId)
        .then( result => {
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
};
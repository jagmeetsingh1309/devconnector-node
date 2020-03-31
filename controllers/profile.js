const mongoose = require('mongoose');
const moment = require('moment');
const { validationResult } = require('express-validator');

const Profile = require('../models/profile');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const User = require('../models/User');

//working correctly and refined.
exports.getProfiles = (req,res,next) => {
    Profile
        .find()
        .then(profiles => {
            res.render('profile/profiles', {
                isLoggedIn: req.session.isLoggedIn,
                profiles: profiles
            });
        })
        .catch(err => console.log(err));
}

//working correctly and refined.
exports.getDashboard = (req,res,next) => {
    const userId = req.session.user._id;
    Experience.find({ user: userId})
        .then( experiences => {
            Education
                .find({ user: userId})
                .then( educations => {
                    res.render('profile/dashboard',{
                        experiences: experiences,
                        educations: educations,
                        isLoggedIn: req.session.isLoggedIn,
                        user: req.session.user,
                        moment: moment,
                        successMessage: req.flash('success'),
                        errorMessage: req.flash('error')
                    });
                })
        })
        .catch(err => console.log(err));
};

//working correctly and refined.
exports.getProfile = (req,res,next) => {
    const id = req.params.id;
    User
        .findOne({ profile: id})
        .populate('profile')
        .then( user => {
            if(user){
                Experience
                    .find({ user: user._id })
                    .then(experiences => {
                        Education
                            .find({ user: user._id })
                            .then(educations => {
                                res.render('profile/profile', {
                                    isLoggedIn: req.session.isLoggedIn,
                                    profile: user.profile,
                                    username: user.name,
                                    experiences: experiences,
                                    educations: educations,
                                    moment: moment
                                });
                            })
                    })
                    .catch(err => console.log(err));
            } else {
                //TODO: Raise an error.
            }
        })
        .catch(err => console.log(err));
}

//working correctly and refined.
exports.getEditProfile = (req,res,next) => {
    const userId = req.session.user._id;
    User.findById(userId)
        .populate('profile')
        .then( user => {
            if(user.profile){
                 // if profile exists then populate the inputs with the profile fields.
                const profile = user.profile;
                 return res.render('profile/edit-profile', {
                    userId: userId,
                    status: profile.status,
                    company: profile.company,
                    website: profile.website,
                    address: profile.address,
                    skills: profile.skills.join(','),
                    description: profile.description,
                    isLoggedIn: req.session.isLoggedIn,
                    imageUrl: profile.imageUrl,
                    errorMessage: '',
                    errors: []
                });
            } else {
                // if profile doesnt exist then return blank inputs.
                return res.render('profile/edit-profile',{
                    isLoggedIn: req.session.isLoggedIn,
                    userId: userId,
                    status: 'none',
                    company: '',
                    website: '',
                    address: '',
                    skills: '',
                    description: '',
                    imageUrl: '',
                    errorMessage: '',
                    errors: []
                });
            }
        })
        .catch(err => console.log(err));
};

//working correctly and refined.
exports.postEditProfile = (req,res,next) => {
    const status = req.body.status;
    const company =  req.body.company;
    const website = req.body.website;
    const address = req.body.address;
    const description = req.body.description;
    const skills = req.body.skills.split(',');
    const userId = req.body.userId;
    const image = req.file;
    let imageUrl;
    if(image){
        imageUrl = image.path;
    }
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('profile/edit-profile',{
            isLoggedIn: req.session.isLoggedIn,
            userId: userId,
            status: 'none',
            company: company,
            website: website,
            address: address,
            skills: skills,
            description: description,
            imageUrl: imageUrl,
            errors: errors.array(),
            errorMessage: errors.array()[0].msg
        })
    }

    User.findById(userId)
        .populate('profile')
        .then( user => {
            if(user){
                let profile;
                if(user.profile){
                    profile = user.profile;
                    profile.status = status;
                    profile.company = company;
                    profile.website = website;
                    profile.address = address;
                    profile.description = description;
                    profile.skills = skills;
                    profile.imageUrl = imageUrl;
                } else {
                    profile = new Profile({
                        status: status,
                        company: company,
                        website: website,
                        address: address,
                        description: description,
                        skills: skills,
                        imageUrl: imageUrl
                    });
                }
                profile.save()
                    .then( profile=> {
                        user.profile = profile._id; 
                        user.save()
                            .then( () => {
                                req.flash('success','Profile Created Successfully.');
                                res.redirect('/dashboard')
                            })
                    })
                    .catch(err => console.log(err));
            } else {
                //TODO: Raise an error.
            }
        })
        .catch(err => console.log(err));
};

exports.postDeleteAccount = (req,res,next) => {
    const userId = req.body.userId;
    Experience
        .deleteMany({ userId: userId})
        .then( () => {
            Education
                .deleteMany({ userId: userId })
                .then( () => {
                    Profile
                        .deleteOne({ userId: userId })
                        .then( () => {
                            User
                                .findByIdAndDelete(userId)
                                .then( () => {
                                    req.session.destroy( () => {
                                        res.redirect('/');
                                    })
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}

























const express = require('express');
const { body } = require('express-validator');

const profileController = require('../controllers/profile');
const authController = require('../controllers/auth');
const experienceController = require('../controllers/experience');
const educationController = require('../controllers/education');

const router = express.Router();

router.get('/profiles', profileController.getProfiles);

router.get('/profiles/:id', profileController.getProfile);

router.get('/dashboard',authController.getIsLoggedIn,profileController.getDashboard);

router.get('/edit-profile',authController.getIsLoggedIn, profileController.getEditProfile);

router.post(
    '/edit-profile',
    [
        body('status', 'Status is required.')
        .isLength({ min: 1}),
        body('address', 'Address is required.')
        .isLength({ min: 1}),
        body('description', 'Description is required.')
        .isLength({ min: 1}),
        body('skills', 'Skills is required.')
        .isLength({ min: 1})
    ],
    profileController.postEditProfile);

router.get('/add-experience',authController.getIsLoggedIn, experienceController.getAddExperience);

router.post(
    '/add-experience',
    [
        body('title','Title is required.')
        .isLength({ min: 1}),
        body('company', 'Company is required.')
        .isLength({ min: 1}),
        body('startDate', 'Start Date is required.')
        .isLength({ min: 1}),
        body('endDate','End Date is required.')
        .isLength({ min: 1}),
        body('description', 'Description is required.')
        .isLength({ min: 1})
    ],
    experienceController.postAddExperience);

router.get('/add-education',authController.getIsLoggedIn, educationController.getAddEducation);

router.post(
    '/add-education',
    [
        body('school' ,'School is required.')
        .isLength({ min: 1}),
        body('degree', 'Degree is required.')
        .isLength({ min: 1}),
        body('startDate', 'Start Date is required.')
        .isLength({ min: 1}),
        body('endDate','End Date is required.')
        .isLength({ min: 1}),
        body('description', 'Description is required.')
        .isLength({ min: 1})
    ],
    educationController.postAddEducation);

router.post('/delete-experience', experienceController.postDeleteExperience);

router.post('/delete-education', educationController.postDeleteEducation);

router.post('/delete-account', profileController.postDeleteAccount);

module.exports = router;
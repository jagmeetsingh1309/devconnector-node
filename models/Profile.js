const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    status : {
        type: String,
        required: true
    },
    company: String,
    website: String,
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('Profile', profileSchema);
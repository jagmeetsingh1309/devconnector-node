const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const educationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Education', educationSchema);
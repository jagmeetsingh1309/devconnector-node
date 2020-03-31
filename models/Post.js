const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: Array,
        default: []
    },
    dislikedBy: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Post', postSchema);
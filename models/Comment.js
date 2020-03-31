const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
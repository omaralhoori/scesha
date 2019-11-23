const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: Buffer,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
        timestamps: true
    })
const Post = mongoose.model('Post', postSchema)

module.exports = Post
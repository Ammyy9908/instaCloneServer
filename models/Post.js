const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    imageurl: {
        type: String,
        required: true,
    },
    imagePublicID: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    authorAvatar: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: false,
    },
    authID: {
        type: String,
        required: false,
    },
    body: {
        type: String,
        required: false,
    },
    hashtag: {
        type: Array,
        required: false,
        default: []
    },
    likes: {
        type: Number,
        default: 0,
        required: false,
    },
    location:{
        type:String,
        required:true
    },
    likedBy: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    comments: {
        type: Array,
        default: []
    },
    posted_by: {
        type: String,
        required: true
    },
    timestamp:{
        type: String,
        required:true
    }

})


module.exports = model('post', postSchema);
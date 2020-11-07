const {Schema,model} = require('mongoose');

const postSchema = new Schema({
    imageurl:{
        type:"string",
        required: true
    },
    posted_by:{
        type:"string",
        required: true
    },
    post_body:{
        type:"string",
        required: true
    },
    hashtag:{
        type:"string",
        required: true
    },
    likes:{
        type:"array",
        default: []
    },
    comments:{
        type:"array",
        default: []
    }
})


module.exports = model('post',postSchema);
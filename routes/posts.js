const router =require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const verify = require('../verifyToken');
const {cloudinary} = require('../utils/cloudinary');


router.post('/new/:uid',async (req,res) => {
   try{
    const {data,tags,post_body} = req.body;
    // first find a user with this uid and extract name
    const user = await User.findOne({_id:req.params.uid});
    if(!user){
        return res.status(403).json({message:"Unauthorized"});
    }

    const uploadResponse = await cloudinary.uploader.upload(data, { 
        upload_preset:'posts'
        })


    const newPost = Post({
        imageurl:uploadResponse.url,
        body:post_body,
        hashtag:tags.split(' ').filter(v=> v.startsWith('#')),
        posted_by:user.username,
        authID:req.params.uid,
        imagePublicID:uploadResponse.public_id,
        authorName:user.name,
        authorAvatar:user.avatar?user.avatar:`https://avatars.dicebear.com/api/avataaars/${user.username}.svg`,
        timestamp:new Date().getTime()
    })
 
    const savedPost = await newPost.save();
    if(!savedPost){
        return res.status(500).json({message: "There is some error while saving the post."});
    }
    return res.status(200).send(savedPost);
   }
   catch(err) {
       res.status(500).json({message: err});
   }

    
}).get('/sync/',async (req,res) => {
    const posts = await Post.find();
    if(!posts) {
        return res.status(400).json({message:"No Post found for this user"});
    }
    res.status(200).send(posts);
})

module.exports = router;
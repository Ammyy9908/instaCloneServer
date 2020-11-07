const router =require('express').Router();
const Post = require('../models/Post');
const verify = require('../verifyToken');


router.post('/new',verify,async (req,res) => {
    const {imageurl,post_body,hashtag,posted_by} = req.body;
   // check for empty fields
   if(!imageurl || !post_body || !hashtag || !posted_by){
       return res.status(400).json({message:"All fields Required!"});
   }
   const newPost = Post({
       imageurl,
       post_body,
       hashtag,
       posted_by,
   })

   const savedPost = await newPost.save();
   if(!savedPost){
       return res.status(500).json({message: "There is some error while saving the post."});
   }
   return res.status(200).send(savedPost);

    
}).get('/sync/:uid',verify,async (req,res) => {
    const posts = await Post.find({posted_by: req.params.uid});
    if(!posts) {
        return res.status(400).json({message:"No Post found for this user"});
    }
    res.status(200).send(posts);
})

module.exports = router;
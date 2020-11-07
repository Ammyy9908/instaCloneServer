const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../verifyToken');
const multer = require('multer');
const storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, new Date().toUTCString() + file.originalname),

});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error('Choose a Valid Image Type'), false);
    }


}
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1.5 },
    fileFilter: fileFilter
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // check for empty fields
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are empty." });
    }
    // check the user in the database
    const user = await User.findOne({ email, });
    if (!user) {
        return res.status(403).json({ message: "Invalid username and password." });
    }
    // compare the password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(403).json({ message: "Invalid username and password." });
    }
    // make a json web token
    const token = await jwt.sign({ id: user._id }, 'shhh');
    res.status(200).json({ token: token });
}).post('/register', async (req, res) => {
    const { name, uname, email, password } = req.body;
    // First Check for empty fields
    if (!name || !uname || !email || !password) {
        return res.status(400).json({ message: "Fields are required" });
    }
    // Check password should be have 6 character long
    if (password.length < 6) {
        return res.status(400).json({ message: "Password should be have 6 character long" });

    }
    // Check is the user exists in database with the same username and email
    const user = await User.findOne({ email: email });
    if (user) {
        return res.status(400).json({ message: "User Already Exists with this email and username" });
    }
    // 
    else {
        // create a hashed password before saving it to database
        const hashed = await bcrypt.hash(password, 10);
        // save the user to databse
        const newUser = new User({
            name,
            username: uname,
            email,
            password: hashed,

        });
        const savedUser = await newUser.save();
        if (!savedUser) {
            return res.status(500).json({ message: "Something went wrong with the Database while registering!" });
        }
        res.status(200).send({ message: "User successfully Registered!" });
    }


}).get('/user', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    res.status(200).send({ id: user._id, name: user.name, email: user.email, uname: user.username, followers: user.followers, followings: user.followings, avatar: user.avatar, website: user.website, bio: user.bio, sex: user.sex, phone: user.phone });
}).post('/user/update/:uid', async (req, res) => {
    const { uname, email, name, bio, sex, website, phone } = req.body;
    const uid = req.params.uid;
    //first check for empty fields
    if (!name || !uname || !website || !bio || !email || !phone || !sex) {
        return res.status(403).json({ message: "All Fields Required" });
    }
    //match the user with this uid

    const user = await User.findOne({ _id: uid });
    if (!user) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedUser = await User.updateOne({ _id: uid }, { username: uname, email, name, bio, sex, website, phone });
    if (!updatedUser) {
        return res.status(500).json({ message: "Problem occured." });
    }
}).post('/user/picture/change/:uid', upload.single('profileImg'), async (req, res) => {
    // Everything went fine.
    // Update the User avatar file to this file
    const uid = req.params.uid;
    const updatedUser = await User.findByIdAndUpdate({ _id: uid }, { avatar: req.file.path });
    if (!updatedUser) {
        return res.status(403).json({ message: 'Invalid User id' });
    }
    const user = await User.findOne({ _id: req.params.uid });
    res.status(200).send({ message: "Profile Picture Updated successfully", user: { id: user._id, name: user.name, email: user.email, uname: user.username, followers: user.followers, followings: user.followings, avatar: user.avatar } });
}).post('/user/change/pass/:uid', async (req, res) => {
    const { opass, npass } = req.body;

    const user = await User.findOne({ _id: req.params.uid });
    if (!user) {
        return res.status(403).json({ message: 'unauthorized' });
    }
    // compare the user  password with the old password which comes from request body
    const isValid = await bcrypt.compare(opass, user.password);
    if (isValid) {
        // first create a new hash
        const hashed = await bcrypt.hash(npass, 10);
        // Change the new password of the user
        const updatedUser = await User.updateOne({ _id: req.params.uid }, { password: hashed });
        if (!updatedUser) {
            return res.status(500).json({ error: 'Error while updating password.' });
        }
        return res.status(200).send({ message: 'Password updated successfully.' });
    }
    res.status(400).json({ message: 'Incorrect Old Password.' });


})

module.exports = router;
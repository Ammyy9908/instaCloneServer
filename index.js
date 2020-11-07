const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config()


const app = express();

// connect to databse

mongoose.connect('mongodb+srv://Sumit:2145255sb8@cluster0.0wij2.mongodb.net/Instagram', { useNewUrlParser: true,useUnifiedTopology: true ,useFindAndModify:true}).then(()=>{
    console.log('Database Connected!')
}).catch((e)=>{
    console.log(e)
})

// middlewares
app.use(cors());
app.use(express.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb'
}));
app.use('/uploads',express.static('uploads'))
app.use('/',authRoute);
app.use('/posts',postRoute);



const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server Listening on ${port}`);
})
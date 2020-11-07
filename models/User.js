const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    name:{
        type:"string",
        required: true
    },
    avatar:{
        type:"string",
        required: false,
        default:''
    },
    username:{
        type:"string",
        required: true
    },
    followers:{
        type:"array",
        default: []
    },
    followings:{
        type:"array",
        default: []
    },
    location:{
        type:"string",
        required: false
    },
    chats:{
        type:"array",
        default: []
    },
    email:{
        type:"string",
        required: true
    },
    password:{
        type:"string",
        required: true
    },
    dob:{
        type:"string",
        required: false
    },
    createdAt:{
        type:"Date",
        default:Date.now()
    },
    lastLogin:{
        type:"Date",
        default:Date.now()
    },
    phone:{
        type:"String",
        required: false,
        default:''
    }
    ,sex:{
        type:"String",
        required: false,
        default:''
    },
    website:{
        type:"String",
        required: false,
        default:''
    },
    bio:{
        type:"String",
        required: false,
        default:''
    }
})


module.exports = model('user',userSchema);
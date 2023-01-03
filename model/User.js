const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{
        type: String,
        required: true
    },
    roles:{
        User:{
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
        
    },
    password:{
        type: String,
        required: true
    },
    refreshToken: String
    ,
    DateCreated:{
        type: Date,
        default:Date.now
    }
});
//model should take the filename sigular...mongoose willpluralizsed it with all lowercase
module.exports=mongoose.model('User',userSchema);
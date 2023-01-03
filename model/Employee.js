const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const Schema=mongoose.Schema;//note everything in mongoose start with a schema

const employeeSchema=new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    DateCreated:{
        type: Date,
        default:Date.now
    }
    
});
//ensure the model name is plural
module.exports=mongoose.model('Employee',employeeSchema);
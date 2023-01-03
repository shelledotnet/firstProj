const express=require('express');
const router=express.Router();
const {v4:uuid}=require('uuid');
const serialize = require('serialize-javascript');
const path=require('path');
const logEvents=require('../middleware/logEvents');
const registercontroller=require('../Controllers/registerController')
const verifyJWT=require('../middleware/verifyJWT');

/* router.route('/')
      .post(registercontroller.handlerNewUser); */

 router.post('/', registercontroller.handlerNewUser);
module.exports=router;
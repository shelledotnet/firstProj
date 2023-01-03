const express=require('express');
const router=express.Router();
const {v4:uuid}=require('uuid');
const serialize = require('serialize-javascript');
const path=require('path');
const logEvents=require('../middleware/logEvents');
const authcontroller=require('../Controllers/authController');

/*  router.route('/')
      .post(authcontroller.handlerLogin);  */

 router.post('/',authcontroller.handlerLogin);

module.exports=router;
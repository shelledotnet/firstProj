const express=require('express');
const router=express.Router();
const {v4:uuid}=require('uuid');
const serialize = require('serialize-javascript');
const path=require('path');
const logEvents=require('../middleware/logEvents');
const logOutController=require('../Controllers/logOutController');

/*  router.route('/')
      .post(authcontroller.handlerLogin);  */

 router.get('/',logOutController.handleLogOut);

module.exports=router;
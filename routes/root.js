const express=require('express');
const router=express.Router();
const {v4:uuid}=require('uuid');
const serialize = require('serialize-javascript');
const path=require('path');
const logEvents=require('../middleware/logEvents');


router.get('^/$|/index(.html)?',(req,res)=>{
    //res.send('Hello world!');
    logEvents('testing','test.txt',uuid())
    res.sendFile(path.join(__dirname,'..','views','index.html'));
})
router.get('/new-page(.html)?',(req,res)=>{
    
    res.sendFile(path.join(__dirname,'..','views','new-page.html'));
})
router.get('/old-page(.html)?',(req,res)=>{
   
    res.redirect(301,'/new-page');
})

router.get('/foo(.html)?',(req,res)=>{
   
    let guids=uuid();
    logEvents(`Request:${req.method}\t${req.headers.origin}${req.url}\tResponse:`+ serialize({'code':200,'description':'success','ref':guids}),'test.txt',guids)
    res.status(200).send({'code':200,'description':'success','ref':guids});  //u cant res or return status u chain it send or sendStatus else the app will collapse
 })

router.get('/hello(.html)?',(req,res)=>{
   
   console.log('attempt to load hello.html');
   res.send('hello world');
   
})

module.exports=router;

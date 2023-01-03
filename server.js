//#region Depencdecy
require("dotenv").config();
const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const connectDB = require("./Config/dbConn");
const chalk = require("chalk");
const { v4: uuid } = require("uuid");
const serialize = require("serialize-javascript");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./Config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const app = express();
const http=require('http')
const fs = require("fs");
const default404 = require("./middleware/default404");
const fsPromises = require("fs").promises;
const path = require("path");
const PORT = process.env.PORT || 3500;
const auditLog=require('./middleware/auditLog')
const EventEmitter=require('events');

//#endregion 
//#region EventEmitter
//inheritance
class MyEmitter extends EventEmitter{};

//create an intance of the class MyEmitter
const myEmitter=new MyEmitter();

/*
//add listener for the log event
myEmitter.on('log',(msg)=>logEvents(msg));
//event emitter
myEmitter.emit('log','Log event emitted');
*/
//#endregion
//#region Middle-wear
//Connect to MongoDB by invoking the unanimouse function
connectDB();

//custom middlware logger
app.use(auditLog);



//Cross Origin Resource Sharing
//allowing all web siteaccess
//app.use(cors());
//allowing sepecific website t access
app.use(cors(corsOptions));



//buit-in middleware to handle urlencoded data
//in other words, form data:
//content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

//buit-in middleware for json
app.use(express.json());

//middleware for cookie
app.use(cookieParser());
//#endregion

//#region ACtionMethod
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh')); //this gives a new accessToken
app.use('/logout',require('./routes/logOut')); //this terminates the referesh token

//app.use(verifyJWT);  //this verifyJWT middleware will affect resources down the line(this will definately affect all and my exception handler)
app.use('/employees',require('./routes/api/employees'));
app.use('/users',require('./routes/api/users'));


app.get("/", (req, res) => {
  res.status(200).send({ code: 200, description: "success", ref: uuid() }); //u cant res or return status u chain it send or sendStatus else the app will collapse
});


//default directory middleware for url not found
app.use(default404);
//#endregion

//Global Exception handler middleware
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log(chalk.blueBright("Connected to MongoDB"));
  //we dont want to listen below for request without connected above datasource for resources
  app.listen(PORT, () =>
    console.log(chalk.redBright(`server running  at ${PORT}...`))
  );
});


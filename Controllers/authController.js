//#region Property 

//#region In-MemoryDB
/*
const usersDB={
    users: require('../model/users.json'),
    setUsers: function(data){this.users=data}  //setting the data to users
}
*/
//#endregion

//#region  write to In-MemoryDB
/*
const fsPromises=require('fs').promises;
const path=require('path');
*/
//#endregion

//#region connect to MongoDB
const User=require('../model/User')  
//#endregion

// Importing date-and-time module
const date = require('date-and-time');
const now  =date.addHours(new Date(),1);
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
//#endregion
//#region Login
const handlerLogin=async(req,res)=>{
    const{user,pwd}=req.body;
    if(!user || !pwd)return res.status(400).json({'message':'Username and password ae required.'});

    //#region find user in the In-MemoryDB
   // const founderUser=usersDB.users.find(person=>person.username===user);
    //#endregion

    //#region find user in the In-MongoDB
    const founderUser=await User.findOne({username: user}).exec();
    //#endregion
    
    if(!founderUser) return res.sendStatus(401);  //Unauthorized

    //evaluate password
 
    const match=await bcrypt.compare(pwd,founderUser.password)
    if(match){
      const roles = Object.values(founderUser.roles);
      //create JWTs(accestoken, refereshToken, identityToken) to authorize the rest funcctions
      //u dont want to pass senditive user data (password) to guid agaisnt snifing of ur password .. username is prefered
      //below are what we use to create the access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: founderUser.username,
            roles: roles,
          },
        }, //login user
        process.env.ACCESS_TOKEN_SECRET, //secretKey at environment variables
        {
            expiresIn: "300s", //time to expire (5min to 15min on prod)
            audience: process.env.AUDIENCE,
            issuer: process.env.ISSUER
         
        }
      );
      const refreshToken = jwt.sign(
        { username: founderUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        {
          
            expiresIn: "1d", //refershtoken can last up to 1yr
            audience: process.env.AUDIENCE,
            issuer: process.env.ISSUER
        }
      );

      //#region saving refereshToken with current user In-Memory
      /*
      const otherUsers=usersDB.users.filter(person=>person.username !== founderUser.username);//get array of other users excluding the current user
      const currentUser={...founderUser,refreshToken}; //set current user to founduser add referehToken to the current user
      usersDB.setUsers([...otherUsers,currentUser]);//add current user to othrusers in userDB (sort of in-memeory storage)

     await fsPromises.writeFile(
        path.join(__dirname, '..','model','users.json'),
        JSON.stringify(usersDB.users)  //this werite json format to the db
     );
     */
      //#endregion

      //#region saving refereshToken with current user MongoDB
      founderUser.refreshToken = refreshToken;
      const result = await founderUser.save();
      console.log(result); //dont forget to delete this on PROD
      //#endregion

      //ensure u store d referesh token in memory dont store in local storage is not save...u can as well send it as  cookie (set it http-Only) with this is not vulnerable is not assceeble by javascript
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      //res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000}); // on PROD
      //secure:true -only serves on https not in development please add this when creatingcookies as well in prod

      //pls dont send the refershToke in json to the client only the accessToken is most preferd, send the refersh token as a cookie
      res
        .status(200)
        .json({
          success: `User ${user} is logged in!`,
          accessToken,
          expires: date.addSeconds(now, 300),
        });
    }else{
        return res.sendStatus(401); //Unauthorized
    }
}
//#endregion

module.exports={handlerLogin};
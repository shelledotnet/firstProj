//#region  Property

//#region In-MemoryDB
/*
const usersDB={
    users: require('../model/users.json'),
    setUsers: function(data){this.users=data}  //setting the data to users
}
*/
//#endregion

//#region connect to MongoDB
const User=require('../model/User')  
//#endregion


// Importing date-and-time module
const date = require('date-and-time');
const now  =date.addHours(new Date(),1);
const { decode } = require('jsonwebtoken');
const jwt=require('jsonwebtoken');
//#endregion

//#region jwt
const handleRefreshToken=async  (req,res)=>{
    const cookies=req.cookies;
    console.log(cookies);
    //check to see if cookies is true then if jwt is also in the cookies else 401 unAuthorize
    if(!cookies?.jwt)return res.sendStatus(401);
    const refreshToken=cookies.jwt;

    //#region found user In-Memory
    //const founderUser=usersDB.users.find(person=>person.refreshToken===refreshToken);
    //#endregion

     //#region found user MongoDB
     //there is refershtoken property in the user model which is same with the request 
     //we are comparing so we only use one refereshtoken:refereshtoken
     const founderUser=await User.findOne({refreshToken}).exec();
     //#endregion

    if(!founderUser) return res.sendStatus(403);  //forbidden

    //evaluate jwt (token validation)
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
        if(err || founderUser.username !== decoded.username)return res.sendStatus(403); //forbidden
        const roles=Object.values(founderUser.roles);
        //once we have verify the refresh token will goahead to create new accesstoiken
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              roles: roles,
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
           
              expiresIn: "300s", //time to expire (5min to 15min on prod)
              audience: process.env.AUDIENCE,
              issuer: process.env.ISSUER
            
          }
        );

                //pls dont send the refershToke in json to the client only the accessToken is most preferd, send the refersh token as a cookie
               res.status(200).json({'success':`User ${founderUser.username} is logged in!`,accessToken,'expires':date.addSeconds(now,300)});
        }
    )
   
}
//#endregion

module.exports={handleRefreshToken}
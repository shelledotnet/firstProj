//#region  Property
//#region In-MemoryDB
/*
const usersDB={
    users: require('../model/users.json'),
    setUsers: function(data){this.users=data}  //setting the data to users
}
*/
//#endregion

//#region write to In-MemoryDB
/*
const fsPromises=require('fs').promises;
const path=require('path');
*/
//#endregion

//#region connect to MongoDB
const User=require('../model/User')  
//#endregion

const { decode } = require('jsonwebtoken');
const jwt=require('jsonwebtoken');
//#endregion

//#region jwt
const handleLogOut=async (req,res)=>{
    //NOTE on client for the consumer of the backEndService , also delete the accessToken in the memory of the client application
   
    const cookies=req.cookies;
    //check to see if cookies is true then if jwt is also in the cookies if not found then is ok 204
    if(!cookies?.jwt)return res.sendStatus(204);  //its successful NoContent
   //NOTE u cant res or return status u chain it send or sendStatus else the app will collapse
    const refreshToken=cookies.jwt;

    //Is freshToken in the DB
    //#region found user refreshToken In-MemoryDB
    //const founderUser=usersDB.users.find(person=>person.refreshToken===refreshToken);
    //#endregion

     //#region found user refreshToken MongoDB
     const founderUser=await User.findOne({refreshToken}).exec();
     //#endregion


    if(!founderUser){
        //remember will have a  cookies to get to this point of the application so we need to clear the cookies
        //with the cookie name an all the optional materials set at the point of creating
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
        return res.sendStatus(204); //NoContent
    }

    //#region  esle if the refesh token is foundin the db delete the referesh token  In-MemoryDB
    /*
    const otherUsers=usersDB.users.filter(person=>person.refreshToken !== founderUser.refreshToken);
    const currentUser={...founderUser,refreshToken:''};
    usersDB.setUsers([...otherUsers,currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );
    */
   //#endregion

   //#region  delete refereshToken MongoDB
    founderUser.refreshToken='';
    const result=await founderUser.save();
    console.log(result)  //dont forget to delete this on PROD
   //#endregion

    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
     //secure:true -only serves on https not in development please add this when creatingcookies as well in prod
    return res.sendStatus(204); //NoContent
}
//#endregion

module.exports={handleLogOut}
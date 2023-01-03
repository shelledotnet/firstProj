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

const bcrypt=require('bcrypt');

//#region CreateUser
const handlerNewUser=async(req,res)=>{
    const{user,pwd}=req.body;
    if(!user || !pwd)return res.status(400).json({'message':'Username and password are required.'});

    //#region check for duplicate usernames in the In-MemoryDB
    //const duplicate=usersDB.users.find(person=>person.username===user);
    //#endregion

    //#region check for duplicate usernames MongoDB
    const duplicate=await User.findOne({username: user}).exec();
   //#endregion

    if(duplicate)return res.sendStatus(409); //confict
    try{
        //encrypt the password an add salt
        const hashedPwd=await bcrypt.hash(pwd, 10); //(add 10 salt round)
        
        //#region create user MongoDB
        const result=await User.create({
            "username":user,
            // "roles":{"User":2001},role willl be created by default on user model creation
            "password":hashedPwd
        });
        console.log(result);//please remove this at prod
        //#endregion

        //#region create user In-MemoryDB
        /*
        //store the new user
        const newUser={
            "username":user,
            "roles":{"User":2001},
             "password":hashedPwd
            };
        usersDB.setUsers([...usersDB.users,newUser]); //setting the newuser
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(newUser);
        */
        //#endregion
        
        res.status(201).json({'success':`New user ${user} created`});

    }catch(err){
     res.status(500).json({'message':err.message});
    }
}
//#endregion

module.exports={handlerNewUser};
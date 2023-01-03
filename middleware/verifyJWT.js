const jwt=require('jsonwebtoken');

const verifyJWT=(req,res,next)=>{
    //const authHeader=req.headers['authorization'];
    const authHeader=req.headers.authorization || req.headers.Authorization
    //if we have authheader and authheader startwith Bearer
    if(!authHeader?.startsWith('Bearer '))return res.sendStatus(401); //unAuthorized
    const token=authHeader.split(' ')[1];

    //this validate the token
    jwt.verify(token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403)//invalid token forbidden
            req.user=decoded.UserInfo.username;
            req.roles=decoded.UserInfo.roles; //remeber this roles could be more than one
            //console.log(req.roles)//please removethis in prod
            next(); //indicate lets move on everyhting is good , will allow the route to be access
        }
    )
}

module.exports=verifyJWT
const {validateToken}=require('../services/auth');

function checkForAuthCookie(cookieName){
    return (req,res,next)=>{
        const token=req.cookies[cookieName];
        if(!token){
            // return res.status(401).send('Unauthorized');
           return next();
        }
        try{
            const userPayload=validateToken(token)
            req.user=userPayload;
        }catch (err){}
       return next();
    };
}

module.exports={
    checkForAuthCookie
}
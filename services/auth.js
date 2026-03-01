const jwt=require('jsonwebtoken');
const secret="mysecretkey";

function createToken(user){
    const payload={
        _id:user._id,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role
    };
    const token= jwt.sign(payload,secret);
    return token;
}
function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={
    createToken,
    validateToken
}
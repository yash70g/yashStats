const mongoose = require('mongoose');
const { Schema } = mongoose;
const {createHmac,randomBytes} = require('crypto');
// Authentication removed: no token creation/validation here.
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String, 
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
},
    {timestamps: true}
);

userSchema.pre('save',function (){
    const user=this;
    if(!user.isModified('password')){
        return;
    }
    const salt=randomBytes(16).toString('hex');
    const hash=createHmac('sha256',salt).update(user.password).digest('hex');
    console.log('Salt:',salt);
    this.salt=salt;
    this.password=hash;
});

userSchema.static('authenticate', async function (email,password){
    const user = await this.findOne({ email });
    if(!user){
        throw new Error('User not found');
    }
    const salt = user.salt;
    const hashedPassword = user.password;
    const hash = createHmac('sha256', salt).update(password).digest('hex');
    const isMatch = hash === hashedPassword;
    if(isMatch){
        return user;
    } else {
        throw new Error('Invalid password');
    }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
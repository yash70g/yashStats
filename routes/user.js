const express = require('express');
const router = express.Router();
const User = require('../models/user');

// router.get('/signin',(req,res)=>{
//     res.render('signin.ejs');
// })

router.get('/signup',(req,res)=>{
    res.render('signup.ejs');
})
router.get('/signin',(req,res)=>{
    res.render('signin.ejs');
})

router.post('/signup',async (req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({fullName,email,password});
    return res.redirect('/');
});

router.post('/signin',async (req,res)=>{
   try {
    const {email,password}=req.body;
    const token=await User.matchPasswordAndGenerateToken(email,password);
    console.log(token);
    return res.cookie('token',token).redirect('/');
}
catch (err) {
    console.error(err);
    return res.status(401).send('Invalid email or password');   
}
});

router.get('/signout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
});

module.exports = router;
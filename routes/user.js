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
    const {email,password}=req.body;
    const user=await User.matchPassword(email,password);
    console.log(user);
    return res.redirect('/');
});

module.exports = router;
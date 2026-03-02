const express = require('express');
const router = express.Router();
const User = require('../models/user');
// Authentication removed: no tokens/cookies are set.

// router.get('/signin',(req,res)=>{
//     res.render('signin.ejs');
// })

// router.get('/signup',(req,res)=>{
//     res.render('signup.ejs');
// })
// router.get('/signin',(req,res)=>{
//     res.render('signin.ejs');
// })

router.post('/signup',async (req,res)=>{
    const {fullName,email,password}=req.body;
    try {
        const user = await User.create({fullName,email,password});
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error creating user');
    }
});

router.post('/signin',async (req,res)=>{
   try {
    const {email,password}=req.body;
    const user = await User.authenticate(email,password);
    return res.redirect('/');
}
catch (err) {
    console.error(err);
    return res.status(401).send('Invalid email or password');   
}
});

router.get('/signout',(req,res)=>{
    return res.redirect('/');
});

module.exports = router;
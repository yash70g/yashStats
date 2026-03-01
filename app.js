const express = require('express');
const path = require('path');
require('dotenv').config();
const dns = require('dns');
// force Node resolver to use public DNS servers (helps SRV lookups in some networks)
dns.setServers(['8.8.8.8','1.1.1.1']);
const app=express();
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthCookie } = require('./middlewares/auth');
const Blog = require('./models/blog');

const PORT=process.env.PORT || 3000;
const URI=process.env.MONGO_URI;
        mongoose.connect(URI,{
        }).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB',err);
});
    
app.set('view engine','ejs');
app.set("views",path.resolve("./views"));
// serve static assets (css, js, uploads)
app.use(express.static(path.resolve("./public")));
app.use('/images', express.static(path.resolve("./images")));
app.use(express.urlencoded({extended:true})); 
app.use(cookieParser());
app.use(checkForAuthCookie('token'));

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.get('/',async (req,res)=>{
    try{
        const blogs = await Blog.find().populate('createdBy','fullName email').sort('-createdAt');
        res.render('home.ejs',{
            user:req.user,
            blogs:blogs
        });
    }catch(err){
        console.error(err);
        res.render('home.ejs',{
            user:req.user,
            blogs:[]
        });
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

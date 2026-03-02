const express = require('express');
const path = require('path');
require('dotenv').config();
const app=express();

const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');

const PORT=3000;
const URI = 'mongodb+srv://yash70g:qwerty123@cluster0.ov9niae.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(URI,{
        }).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB',err);
});
    
app.set('view engine','ejs');
app.set("views",path.resolve("./views"));

app.use(express.static(path.resolve("./public")));
app.use('/images', express.static(path.resolve("./images")));
app.use(express.urlencoded({extended:true})); 
app.use(cookieParser());

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

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
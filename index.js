const express = require('express');
const path = require('path');
const app=express();
const userRoute=require('./routes/user');
const mongoose = require('mongoose');

const PORT=3000;

mongoose.connect('mongodb://localhost:27017/blogDB',{
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB',err);
});
    
app.set('view engine','ejs');
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:true})); 

app.use('/user',userRoute);

app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

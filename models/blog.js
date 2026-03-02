const { create } = require('./user');

const {Schema,model}=require('mongoose');
const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    coverImageUrl:{
        type:String,
        default:"/images/default.png",
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:false,
    },
},
{timestamps:true}
);

const Blog=model('blog',blogSchema);

module.exports=Blog;
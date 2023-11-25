const { response } = require("express");
const blogPostArray=require("./data");
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const app=express();
require("dotenv").config();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("Public"))

const mongodbURL=process.env.MONGO_URL;
mongoose.connect(mongodbURL)
.then(()=>{
   console.log("database connected successfully");
})
.catch((err)=>{
   console.log("Error occured whie connecting to db",err);
});


const blogSchema=new mongoose.Schema({
    title:String,
    imageURL:String,
    description:String
});

const Blog=new mongoose.model("blog",blogSchema);


app.get("/",(req,res)=>{

    Blog.find({})
    .then((arr)=>{
        res.render("index",{blogPostArray:arr})
     })
     .catch((err)=>{
        console.log("cannot find blogs");
        res.render("404");
     });
    
 //res.sendFile(__dirname+"/index.html");
 //res.render("index")
})
app.get("/Contact",(req,res)=>{
    res.render("contact")
   })
app.get("/About",(req,res)=>{
    res.render("about")
   })
app.get("/Compose",(req,res)=>{
    res.render("compose")
   })
app.post("/compose",(req,res)=>{
    //const newid=blogPostArray.length+1;
   const image=req.body.imageURL;
   const title=req.body.title;
   const description=req.body.description;

   const newBlog=new Blog({
    imageURL:image,
    title:title,
    description:description
   })

   newBlog.save()
   .then(()=>{
    console.log("Blog posted successfully");
 })
 .catch((err)=>{
    console.log("Error posting on blog",err);
 });
//    const obj={
//     _id:newid,
//     imageURL:image,
//     title:title,
//     description:description
//    }
   //blogPostArray.push(obj);
   res.redirect("/");
})
app.get("/post/:id",(req,res)=>{
    console.log(req.params.id);
    const id=req.params.id;
    let title="";
    let imageURL="";
    let description="";
    blogPostArray.forEach(post=>{
        if(post._id==id){
            title=post.title;
            imageURL=post.imageURL;
            description=post.description;

        }

    })
    const post={
        title:title,
        imageURL:imageURL,
        description:description
    }
    res.render("post",{post:post})
   })

const port=3000 || process.env.PORT;
app.listen(port,()=>{
 console.log("Server is listening on port 3000");
})
const express=require('express');

const app = express();
const path=require('path');
const mongoose = require('mongoose');
const Product=require("./Models/product");
const Farm=require("./Models/farm");
const AppError=require("./AppError");
const session=require("express-session");
const flash=require("connect-flash");

const methodOverride=require("method-override");
mongoose.connect('mongodb://localhost:27017/farmApp',{useNewUrlParser: true,useUnifiedTopology: true})
   .then(()=>{
        console.log('connection open');
   })
   .catch(err=>{
       console.log(err);
   })
   app.use(express.static(path.join(__dirname, '/public')))
app.set("views",path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:true}))
app.use(methodOverride("_method"));
app.use(express.json());
app.use(session({secret:"secret",resave:false,saveUninitialized:false}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages=req.flash("sexret");
    next();
})
function wrapAsync(fn){
    return function(req, res,next){
        fn(req,res,next).catch((e)=>next(e))
    }
}
app.get("/products",async (req,res,next)=>{
    try{
    const {category}=req.query;
    if(category){
        const products=await Product.find({category});
   
    res.render("products.ejs",{products,category});
    }else{
    const products=await Product.find({});
   
    res.render("products.ejs",{products,category:"All"});
    }} catch (e) {next(e);}
    
})
app.get("/farms",async (req,res)=>{
    const farms=await Farm.find({});
    res.render("farms.ejs",{farms});
})
const categories=["fruit","veg","dairy"];
app.get("/products/new",(req,res)=>{
    res.render("new",{categories});
})
app.get("/farms/new",(req,res)=>{
    res.render("newfarm");
})
app.post("/products",async (req,res,next)=>{
    try{
  const newProduct=new Product(req.body);
  await newProduct.save(); 
  res.redirect(`/products/${newProduct.id}`)}
  
  catch (e){next(e);} 
})
app.post("/farms",async (req,res)=>{
    const newFarm=new Farm(req.body);
    await newFarm.save(); 
    req.flash("sexret","lawda ho gya");
    res.redirect("/farms");
})
app.get("/products/:id",async (req,res,next)=>{
    try{
    const {id}=req.params;
    const product=await Product.findById(id).populate("farm");
    if(!product){
          throw new AppError("invalid id",404);
    }
    
    res.render("show.ejs",{product});
}catch(e){next(e);}
})
app.get("/farms/:id",async(req, res)=>{
    const {id}=req.params;
    const farm=await Farm.findById(id).populate("products");
    res.render("showfarm.ejs",{farm});
})
// app.get("/products/:id",async (req,res,next)=>{

//     const {id}=req.params;
//     const product=await Product.findById(id);
//     if(!product){
//           return next(new AppError("invalid id",404));
    
    
//     res.render("show.ejs",{product});

// })
app.get("/products/:id/edit",wrapAsync(async (req,res,next)=>{
    
    const {id}=req.params;
    const product=await Product.findById(id);
    res.render("edit",{product,categories});
    
}))
app.put("/products/:id",async (req,res,next)=>{
    try{
   const {id}=req.params;
   const product=await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
   res.redirect(`/products/${product.id}`) 
    }catch(e){next(e);}
})
app.delete("/products/:id", async(req,res,next)=>{
    try{
    const {id}=req.params;
    const deleted=await Product.findByIdAndDelete(id);
    res.redirect("/products");
    }catch(e){next(e);}
})

app.get("/farms/:id/products/new", async(req,res)=>{
    const {id}=req.params;
    const farm=await Farm.findById(id);
    res.render("new",{categories,farm});
})

app.post("/farms/:id/products",async (req,res)=>{
    const {name,cost,category}=req.body;
    const {id}=req.params;
    const farm=await Farm.findById(id);


    const product=new Product({name,cost,category});
    farm.products.push(product);
    product.farm=farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`);


})
app.delete("/farms/:id",async(req,res)=>{
   
    const farm=await Farm.findByIdAndDelete(req.params.id);
    res.redirect("/farms");
})

const handle =err=>{  
return new AppError("validatuon",404);

}
// app.use((err, req, res, next)=>{

//     if(err.name=="ValidationError"){err=handle(err);
//     next(err);
//     }
// })
app.use((err,req,res,next)=>{
    const {status=500,message="error error"}=err;
    res.status(status).send(message);
})
app.listen(300,()=>{
    console.log("listening");
})
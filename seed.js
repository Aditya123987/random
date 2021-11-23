const mongoose = require('mongoose');
const Product=require("./Models/product");
mongoose.connect('mongodb://localhost:27017/farmApp',{useNewUrlParser: true,useUnifiedTopology: true})
   .then(()=>{
        console.log('connection open');
   })
   .catch(err=>{
       console.log(err);
   })


   const data=[
       {name:"Egg",cost:200,category:"veg"},
       {name:"Tomato",cost:22,category:"fruit"},
       {name:"Potato",cost:90,category:"fruit"},
       {name:"paneer",cost:22923,categoty:"dairy"}
   ]

   Product.insertMany(data)
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
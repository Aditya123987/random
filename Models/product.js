const mongoose=require("mongoose");
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true,
        min:0
    },
    category:{ 
        type:String,
        enum:["fruit","veg","dairy"]
    },
    farm:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Farm"
    }
})
const Product=mongoose.model("Product",productSchema);
module.exports=Product;
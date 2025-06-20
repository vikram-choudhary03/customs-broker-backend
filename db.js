const mongoose = require('mongoose'); 
require('dotenv').config(); 

const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hjzcu.mongodb.net/custom_broker`; 


mongoose.connect(DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));


  
const customerSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true
    },
    gstin : {
        type : String, 
        required : true, 
        maxLength : 15, 
        minLength : 15,
    },
    email : {
        type : String, 
        required : true, 
    }
})


const branchSchema = new mongoose.Schema({
    branch_code :{
        type : String, 
        required : true
    },
    location :{
        type : String, 
        required : true 
    }  , 
    customer_id : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "Customer"
    }
})

const Customer  = mongoose.model("Customer" ,customerSchema ); 
const Branch = mongoose.model("Branch", branchSchema); 


module.exports ={
    Customer, 
    Branch
}


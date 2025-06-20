const express  = require("express"); 
const { Customer, Branch } = require("../db");
const router = express.Router(); 
const zod = require('zod'); 
const { email } = require("zod/v4");
const { default: mongoose } = require("mongoose");


const registerSchema = zod.object({
    name : zod.string().trim().min(1), 
    gstin : zod.string().min(15).max(15), 
    email : zod.string().email()
})


/**
 * @swagger
 * /customers/add:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               gstin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid input
 *       409: 
 *         description : customer already exists
 */

router.post("/add" , async (req, res)=>{

    const  result = registerSchema.safeParse(req.body); 
    console.log(result.data);

    if(!result.success){
        console.log(result.error.issues);
        return res.status(400).json({
            msg: "Inputs are incorrect/Not in the right format, Please check it" 
        })
    }
    
    const existingCustomer =  await Customer.findOne({
        email : result.data.email 
    })

    const existgstin = await Customer.findOne({
        gstin : result.data.gstin
    })

    if(existingCustomer){
        return res.status(409).json({
            msg : "Customer  already exist!" 
        })
    }

    if(existgstin){
        return res.status(409).json({
            msg : "GST Number alredy exist "
        })
    }
   
    const dbcustomer = await Customer.create({
        name : result.data.name, 
        gstin : result.data.gstin, 
        email : result.data.email 
    })

    res.status(201).json({
        msg : "Customer is added"  ,
        customer : dbcustomer
    })


})





const updateSchema  = zod.object({
    id: zod.string().length(24),
    name : zod.string().trim().min(1),
    email : zod.string().email() 
    
})

//to edit customer data 

/**
 * @swagger
 * /customers/edit:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Invalid input
 *       409: 
 *         description : customer already exists
 *       404:
 *         description : Customer not found
 */
router.put("/edit" , async (req, res)=>{
 
    const result = updateSchema.safeParse(req.body);  //zod validation 

    console.log(result.data); 

    if(!result.success){
        console.log(result.error.format() );
        return res.status(400).json({
            msg: "Inputs are incorrect/Not in the right format, Please check it",
            errors: result.error.format()  
        })
    }

    const {id, name ,email}  = result.data ; 
 
    const existing  = await Customer.findOne({email : email}) ; 
    

     if(existing && existing._id.toString() !== id){
        return res.status(409).json({message : "Email already exist for another customer"})
     }  
     
    const updated = await Customer.findByIdAndUpdate(id,{name, email}) ;   //will find by id and update 
     console.log(updated);

     if(!updated){
        return res.status(404).json({
            message : "Customer not found"
        })
     }
     
     res.status(200).json({
        message : "Customer updated successfully",
     })
   
})




/**
 * @swagger
 * /customers/delete:
 *   delete:
 *     summary: delete a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description : Customer not found
 */
const deleteSchema = zod.object({
    id : zod.string().length(24)
})
//to delete customer data
router.delete("/delete" , async (req, res)=>{

    const result = deleteSchema.safeParse(req.body); 

    if(!result.success){
        return res.status(400).json({
            msg : "Incorrect customer Id format" , 
            error : result.error.format()
        })
    }

    const {id } = result.data ; 

    await Branch.deleteMany({ customer_id: id });
    const deleted = await Customer.findByIdAndDelete(id); 
    
    

    if(!deleted  ){
        return res.status(404).json({
            msg : "Customer not found"
        })
    }

    res.status(200).json({
        msg : "Customer successfully deleted"
    })


})





//route parameter id 

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by id
 *     tags: [Customers]
 *     parameters :
 *       - in: path 
 *         name: id
 *         required : true
 *         schema:
 *           type : string
 *         description : Customer Id (mongoose object ID)
 *     responses:
 *       400:
 *         description: Invalid input
 *       404:
 *         description : Customer not found
 */
router.get("/:id" , async (req, res)=>{  

    const id  = req.params.id; 

    console.log(id);

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            msg : "Invalid customer Id format"
        })
    }
    const customer = await Customer.findById(id)

    if(!customer){
        return res.status(404).json({
           msg : "Customer not found"
        })
    }

    res.status(200).json({
         customer 
    })

})





/**
 * @swagger
 * /customers/all/with-branches:
 *   get:
 *     summary: Get a List of customers with all its branches
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: fetched   
 */
router.get("/all/with-branches", async (req, res)=>{

   
    const customers = await Customer.find({});
    console.log(customers); 

    const result =await Promise.all (customers.map(async (customer)=>{
        const branches = await Branch.find({customer_id :customer._id}); 
        
        return {
            id :  customer._id, 
            name : customer.name, 
            gstin : customer.gstin, 
            email : customer.email, 
            branches : branches.map(branch=>({
                branch_code : branch.branch_code, 
                location : branch.location ,
                customerID : branch.customer_id 
            }))
        }
    }))

    res.json({
        customers : result 
    })
})




//listing all customer with their branches


module.exports = router ; 





const express = require('express'); 
const router  = express.Router(); 
const zod = require('zod'); 
const { Branch } = require('../db');
const { default: mongoose } = require('mongoose');


//route handlers 


const createSchema  =  zod.object({
    branch_code : zod.string().trim().nonempty() , 
    location : zod.string().trim().nonempty(),
    customer_id : zod.string().length(24)
})

//creating a branch 

/**
 * @swagger
 * /branches/add:
 *   post:
 *     summary: Create a new Branch
 *     tags: [branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch_code:
 *                 type: string
 *               location:
 *                 type: string
 *               customer_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Invalid input
 *       409: 
 *         description : branch already exists
 */
router.post("/add", async (req ,res)=>{

    const result = createSchema.safeParse(req.body) ; 
    console.log(result.data) ;
    if(!result.success){
            return res.status(400).json({
                msg : "Incorrect Inputs",
                errors  : result.error.format()
            })
    }

    const {branch_code, location, customer_id}  = result.data; 

    const existing = await Branch.findOne({ branch_code}); 
    console.log(existing); 

    if(existing){
        return res.status(409).json({
            msg : "Branch code already exist"
        })
    }

    const branch = Branch.create({
        branch_code : branch_code , 
        location : location , 
        customer_id : customer_id 
    })

    res.status(201).json({
        msg : "Branch is created successfully"
    })
    
})








/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get a customer by id
 *     tags: [branches]
 *     parameters :
 *       - in: query 
 *         name: customerId
 *         required : true
 *         schema:
 *           type : string
 *         description : The ID of the customer to fetch branches for
 *     responses:
 *       400:
 *         description: Invalid input
 *       404:
 *         description : No branches found for this customer ID
 *       200: 
 *         description : list of branches retrived sucessfully
 */     
router.get("/" , async (req, res)=>{

    const  customer_id = req.query.customerId  || ""; 

    if(!mongoose.Types.ObjectId.isValid(customer_id)){
        return res.status(400).json({
            msg : "Invalid Customer Id format"
        })
    }

    const branches = await Branch.find({
        customer_id 
    })

   if(branches.length ==0){
    return res.status(409).json({
        msg : "No branches found for this customer ID ", 
        branches 
    })
   }

    res.status(200).json({
        branch  : branches.map(branch=>({
            id : branch._id, 
            branch_code : branch.branch_code , 
            location : branch.location,
            customedId : branch.customer_id 

        }))
    })
})







module.exports = router 
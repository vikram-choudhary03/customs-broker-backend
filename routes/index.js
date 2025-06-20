const express = require('express'); 

const router = express.Router(); 

const customerRouter = require("./customer"); 
const branchRouter = require("./branch")


router.use("/customers" , customerRouter); 
router.use("/branches", branchRouter); 

module.exports = router; 


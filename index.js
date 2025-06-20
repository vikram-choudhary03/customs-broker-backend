const express  = require('express'); 
const app = express();  

const swaggerUi = require("swagger-ui-express"); 
const swaggerSpec = require('./swagger/swagger.js');

const PORT = 3000; 
const mainRouter = require('./routes/index.js'); 




app.use(express.json());

app.use("/api/v1" , mainRouter); 

app.use("/api-docs" , swaggerUi.serve , swaggerUi.setup(swaggerSpec)); 


app.listen(PORT, ()=>{
    console.log(`Example app is listening on ${PORT}`); 
})






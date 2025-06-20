const swaggerJSDoc = require("swagger-jsdoc");

const options  = {
    definition : {
        openapi : "3.0.0", 
        info : {
            title : "Customs Customer API",
            version : "1.0.0",
            description : "API to manage customers and their branches"
        },
        servers :[
            {
                url : "http://localhost:3000/api/v1",
            },
            
        ],
    },
    apis :["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options); 

module.exports = swaggerSpec ;



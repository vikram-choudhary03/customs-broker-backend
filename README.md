# Customs Broker Backend API

This is a backend code for customs brokers operating across multiple branch locations. 
Built with **Node.js, Express, MongoDB** and documented using **Swagger/OpenAPI**.

---

## 🚀 Features

- Add, edit, delete customers
- Add, edit branches under customers
- List all customers with their branches
- MongoDB with one-to-many relationship
- Swagger UI for API docs
- Zod for input validation

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB (via Mongoose)
- Swagger (swagger-jsdoc + swagger-ui-express)
- Zod for validation

---

## 🔧 Setup Instructions

1. Clone the repo
2. Create a `.env` file with the following:
    ```
        DB_USERNAME
        DB_PASSWORD
    ```
3. Install dependencies:
    ```
    npm install
    ```
4. Run the server:
    ```
    npm run dev
    ```
5. Access Swagger docs at:  
   `http://localhost:3000/api-docs`

---

## 📊 ERD Diagram

See the database schema here:  
[View ERD on dbdiagram.io](https://dbdiagram.io/d/6855726cf039ec6d362ab048)

---

## 🧪 Postman Collection

Import this collection for testing all endpoints:  
📁 `CustomsBroker.postman_collection.json`

---


## Endpoints
- POST /customers/add
- PUT /customers/edit
- DELETE /customers/delete
- GET /customers/:id
- GET /customers/all/with-branches
- POST /branches/add
- GET /branches?customerId=x

---


## 📁 Folder Structure
```
.
├── routes/
│   ├── customer.js
│   ├── branch.js
│   └── index.js
├── swagger/
│   └── swagger.js
├── .env
├── .gitignore
├── CustomsBroker.postman_collection.json
├── db.js
├── index.js
├── package-lock.json
├── package.json
└── README.md
```


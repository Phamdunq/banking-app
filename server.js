require('dotenv').config();
const express = require('express')
const connection = require('./app/configs/database')
const bodyParser = require('body-parser');

// Import routes
const customerRoutes = require('./app/routers/customerRoutes');
const accountRoutes = require('./app/routers/accountRoutes');
const transactionRoutes = require('./app/routers/transactionRoutes');

// app express
const app = express()
const port = process.env.PORT || 8080; //port => hardcode . uat .prod
const hostname = process.env.HOST_NAME;


//config req.body
app.use(express.json()) // phân tích cú pháp JSON
app.use(express.urlencoded({ extended: true })) // for form data

// Middleware cho body-parser
app.use(bodyParser.json());

var cors = require("cors")//Khai báo thư viện cors
app.use(express.json())//Để sử lý dữ liệu json
app.use(express.urlencoded({extended: true}))//Để sử lý dữ liệu URL-encoded
app.use(cors({credentials: true, origin: "*"}))// Chấp thuận cors từ mọi URL

// Khai báo routes
app.use('/api', accountRoutes);
app.use('/api', customerRoutes);
app.use('/api', transactionRoutes);

app.get("/", (req, res, next) => {
  res.send("Home");
});

(async () => {
  try {
      //using mongoose
      await connection();
      app.listen(port, hostname, () => {
          console.log(`Backend zero app listening on port ${port}`)
      })
  } catch (error) {
      console.log(">>> Error connect to DB: ", error)
  }
})()
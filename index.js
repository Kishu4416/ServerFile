
//Import express
const express = require("express");
 
//call express funtion
const app = express();

require("./db");
require("./models/User");
require("./models/product");
require("./models/category");
require('./models/store');

const authRoutes= require('./routes/authRoutes');
const requireToken = require("./Middleware/AuthTokenreq");
const Products = require('./routes/productsRoutes');
const category = require('./routes/categoryRoutes');
const Store= require('./routes/storeroute');
app.use(express.json());
app.use('/public/uploads',express.static(__dirname + '/public/uploads'))
// convert data into json format 
app.use(authRoutes);
app.use(Products);
app.use(category);
app.use(Store);

// if token is their
app.get("/",requireToken, (req, resp) => {
    console.log(req.user);
  resp.send(req.user);
});



app.listen(5000);

const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.mongourl)
  .then(() => {
    console.log("Connected to server Successful");
  })
  .catch((err) => {
    console.log(`Could connect to server` + err);
  });

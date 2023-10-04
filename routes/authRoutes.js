const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { replaceOne } = require("../models/User");

require("dotenv").config();

const bcrypt = require("bcrypt");

//register api 

router.post("/register", (req, resp) => {
  console.log(req.body);
  // resp.send("This is register page for app...");

  const { firstName, email, mobileNo, password, confirmPassword,lastname,address} = req.body;

  if(!firstName || !lastname || !email || !mobileNo || !password || !confirmPassword || !address){
    return resp.status(422).send({error:"Please fill all the fields"});
  }

  User.findOne({ email:email }).then(async (savedUser) => {
    if (savedUser) {
      return resp.status(422).json({ error: " Invalid Credentials Already exist User " });
    }

    const user = new User({
      firstName,
      email,
      mobileNo,
      password,
      confirmPassword,
      lastname,
      address
    });

    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
      resp.send({ token });
    } catch (err) {
      console.log("");
      return resp.status(422).send({ error: err.message });
    }
  });
});


// login post api

router.post("/login", async (req, resp) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return resp.status(422).json({ error: "Please add email and password" });
  }

  const savedUser = await User.findOne({ email: email });
  if (!savedUser) {
    return resp.status(422).json({ error: "Invalid Credentials Please Fill correct Data to login" });
  }

  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log("passsword matched");
        const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
        resp.send({ token:token,id:savedUser._id });
      } else {
        console.log("password does not ,matched");
        return resp.status(422).json({ error: "Invalid Credentials" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});


//get all users

router.get('/login/user',async(req,resp)=>{
  const user =await User.find();
  if(!user){
      resp.status(500).json({success:false})
  }
  resp.send(user);
})

// get users by ID
router.get('/user/:id', async(req,resp)=>{
  const user = await User.findById(req.params.id);
  if(!user) {
      resp.status(500).json({message: 'The User with the given ID was not found.'})
  } 
  resp.status(200).send(user);
})

module.exports = router;

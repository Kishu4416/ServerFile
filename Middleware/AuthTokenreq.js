
// jwt token file
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return resp
      .status(401)
      .send({ error: "You must ne logged in , Provide key" });
  }

  const token = authorization.replace("Bearer ", "");
  //console.log(token);
  next();
};

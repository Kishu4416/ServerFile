const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  mobileNo: Number,
  password: String,
  confirmPassword: String,
  lastname:String,
  address:String
});

userSchema.pre("save", async function (next) {
  const user = this;
  console.log("Before hashing", user.password);
  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 8);
  console.log("After hashing", user.password);
  next();
});
module.exports = mongoose.model("User", userSchema);

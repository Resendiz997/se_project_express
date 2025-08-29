const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "Avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter valid Url",
    },
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email address ",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 5,
    maxlength: 100,
    select: false
  },
});

module.exports = mongoose.model("User", userSchema);

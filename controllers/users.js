const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const { JWT_SECRET } = require("../utils/config");

const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  CREATED_REQUEST,
  SUCCESSFUL_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} = require("../utils/errors");


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err.name);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An unexpected error occurred" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }
   return User.findOne({ email })
    .then((result) => {
      if (result !== null) {
        return res
          .status(CONFLICT)
          .send({ message: "User with this email already exists" });
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) => {
          const userWithoutPassword = user.toObject();
          delete userWithoutPassword.password;
          return res.status(CREATED_REQUEST).send(userWithoutPassword);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Bad request." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
});
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(new Error("User not found"))
    .then((user) => res.status(SUCCESSFUL_REQUEST).send(user))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      if (err.message === "User not found") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An unexpected error occurred" });
    });
};

const signIn = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res
            .status(UNAUTHORIZED)
            .send({ message: "Incorrect email or password" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(SUCCESSFUL_REQUEST).send({ token });
      });
    })
    .catch((err) => {
      console.error(err.name);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An unexpected error occurred" });
});
  };


const updateUserProfile = (req,res)=> {
  const { name, avatar } = req.body;
  const {_id} = req.user;
  User.findByIdAndUpdate(_id, {name, avatar}, {new:true})
  .orFail(new Error("User not found"))
  .then((user) => res.status(SUCCESSFUL_REQUEST).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Bad request." });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
  })
};


module.exports = { getUsers, createUser, getCurrentUser, signIn ,updateUserProfile };

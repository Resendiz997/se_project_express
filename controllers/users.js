const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  CREATED_REQUEST,
  SUCCESSFUL_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
} = require ("../utils/errors");

const getUsers = (req, res,next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    throw new BAD_REQUEST("Email and password are required." );
  }
  return User.findOne({ email })
    .then((result) => {
      if (result) {
        throw new CONFLICT("User with this email already exists" );
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
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .orFail(new Error("User not found"))
    .then((user) => res.status(SUCCESSFUL_REQUEST).send(user))
    .catch(next)
};

const signIn = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BAD_REQUEST("Email and password are required." );
  }
   return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED("Incorrect email or password" );
      }
      return bcrypt.compare(password, user.password)
      .then((match) => {
        if (!match) {
          throw new UNAUTHORIZED("Incorrect email or password");
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(SUCCESSFUL_REQUEST).send({ token });
      });
    })
    .catch(next)
};

const updateUserProfile = (req, res,next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("User not found"))
    .then((user) => res.status(SUCCESSFUL_REQUEST).send(user))
    .catch(next)
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  signIn,
  updateUserProfile,
};

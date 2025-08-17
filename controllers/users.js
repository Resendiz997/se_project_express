const User = require("../models/user");

const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  CREATEED_REQUEST,
  SUCCESSFUL_REQUEST,
} = require("../utils/erros");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
//POST createUser
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(CREATEED_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

//GET userbyId

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
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

module.exports = { getUsers, createUser, getUserById };

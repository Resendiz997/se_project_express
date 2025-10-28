  const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT
} = require("../utils/errors");



const errorHandler = ((err,req,res,next)=>{
  console.error(err)

  if (err.name === "CastError") {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Clothing item is incorrect" });
  }
  if (err.name === "Unauthorized") {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "You are unauthirized to view this information" });
  }

  if (err.name === "DocumentNotFoundError") {
    return res
      .status(NOT_FOUND)
      .send({ message: "Clothing item is not found" });
  }
  if (err.code === 11000) {
    return res
      .status(CONFLICT)
      .send({ message: "User with this email already exists" });
  }

  if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
   }

  const {statusCode = INTERNAL_SERVER_ERROR , message} = err;

 return  res.status(statusCode).send({
    message:statusCode === INTERNAL_SERVER_ERROR ? 'An error ocurred on the server' : message

  });
});

module.exports = errorHandler ;
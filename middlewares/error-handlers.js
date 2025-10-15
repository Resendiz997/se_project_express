  const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../utils/errors");



const errorHandler = ((err,req,res,next)=>{
  console.error(err)

  if (err.name === "CastError") {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Clothing item is incorrect" });
  }

  if (err.name === "DocumentNotFoundError") {
    return res
      .status(NOT_FOUND)
      .send({ message: "Clothing item is not found" });
  }

  if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
   }

  const {statusCode = INTERNAL_SERVER_ERROR , message} = err;

  res.status(statusCode).send({
      message:statusCode === INTERNAL_SERVER_ERROR ? 'An error ocurred on the server' : message

  });
});

module.exports = errorHandler ;
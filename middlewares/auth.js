const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const Unauthorized = require('../utils/unauthorized');


const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
   throw new Unauthorized ("Authorization requierd");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log('JWT verification error:', err.message);
    throw new Unauthorized ("Authorization requierd");
  }
  req.user = payload;

  return next();
};

module.exports = auth;

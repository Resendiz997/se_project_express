const router = require('express').Router();
const {userAuthentication, userCreation} = require('../middlewares/validation')

const items = require('./items');
const userRouter = require('./users');
const {NOT_FOUND} = require("../utils/errors");
const {createUser, signIn} = require("../controllers/users");

router.use('/users', userRouter);
router.use('/items',items);

("/signin",userAuthentication,signIn);
("/signup", userCreation,createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({message: "Requested resource not found"});
});

module.exports = router;
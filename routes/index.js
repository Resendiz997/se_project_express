const router = require('express').Router();


const items = require('./items');
const userRouter = require('./users');
const {NOT_FOUND} = require("../utils/erros");


router.use('/users', userRouter);
router.use('/items',items);


router.use((req, res) => {
  res.status(NOT_FOUND).send({message: "Requested resource not found"});
});

module.exports = router;
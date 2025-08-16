const router = require('express').Router();


const items = require('./items');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/items',items);


router.use((req, res) => {
  res.status(500).send({message: "Requested resource not found"});
});

module.exports = router;
const router = require('express').Router();


const clothingItemsRouter = require('./clothingItems');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/clothingItems',clothingItemsRouter);


router.use((req, res) => {
  res.status(500).send({message: "Requested resource not found"});
});

module.exports = router;
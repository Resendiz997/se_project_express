const router = require('express').Router();
const {userAuthentication, userCreation} = require('../middlewares/validation')

const items = require('./items');
const userRouter = require('./users');
const {createUser, signIn} = require("../controllers/users");

const NotFound = require('../utils/notFound');

router.post("/signin",userAuthentication,signIn);
router.post("/signup", userCreation,createUser);



router.use('/users', userRouter);
router.use('/items',items);


router.use((_req,_res,next) => {
  next(new NotFound("Requested resource not found"));
});

module.exports = router;
const router = require("express").Router();
const { celebrate , Joi } = require('celebrate');
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");          


const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required()
  })
});


router.get("/me", auth, getCurrentUser);
router.patch("/me", auth,validateUserUpdate ,updateUserProfile);

module.exports = router;

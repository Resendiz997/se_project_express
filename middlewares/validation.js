const { Joi, celebrate } = require('celebrate');
const validator = require('validator');


const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}


module.exports.itemCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  })
})

module.exports.userCreation= celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
    password: Joi.string().required().min(8).messages({
      'string.empty': 'The "password" field must be filled in',
    }),
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email',
  }),
})
})

module.exports.userAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
})

module.exports.objectIds = celebrate({
params: Joi.object().keys({
  itemId: Joi.string().length(24).hex().messages({
    'string.length': 'The ID must be exactly 24 characters long ',
    'string.hex': 'The ID must be in hexdecimal characters only',
  }),
}),
})



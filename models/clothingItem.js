const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
  name: {type: String ,
    requiered: true ,
    minlength : 2,
    maxlength: 30} ,
  weather: {
    type: String,
    requiered: true,
    enum: ['hot', 'warm', 'cold'],
  },
  imageUrl: {
    type: String,
    requiered: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter valid Url",
    },
  },
});

module.exports = mongoose.model('clothingItem',clothingItemSchema);
const Forbidden = require('../utils/forbiddenError');


const ClothingItem = require("../models/items");

const {
  SUCCESSFUL_REQUEST,
  CREATED_REQUEST,
} = require("../utils/errors");


const createClothingItem = (req, res,next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED_REQUEST).send(item))
    .catch(next)
};

const getClothingItems = (req, res,next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(SUCCESSFUL_REQUEST).send(items);
    })
    .catch(next)
};

const deleteClothingItemById = (req, res,next) => {
  const { clothingItemId } = req.params;
  ClothingItem.findById(clothingItemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new Forbidden ("Access id denied");
      }
      return ClothingItem.findByIdAndDelete(clothingItemId).then(() =>
        res.status(SUCCESSFUL_REQUEST).send({ item })
    )
  })
    .catch(next)
};

const likeItem = (req, res,next) => {
  const { clothingItemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    clothingItemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST).send(item))
    .catch(next)
};

const unlikeItem = (req, res,next) => {
  const { clothingItemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    clothingItemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST).send(item))
    .catch(next);
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItemById,
  likeItem,
  unlikeItem,
};

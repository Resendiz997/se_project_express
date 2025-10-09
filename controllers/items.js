const ClothingItem = require("../models/items");

const {
  SUCCESSFUL_REQUEST,
  CREATED_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED_REQUEST).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
      }
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
        next(err);
      }
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(SUCCESSFUL_REQUEST).send(items);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NOT_FOUND( "Clothing item is not found"));
        next(err);
      }
    });
};

const deleteClothingItemById = (req, res) => {
  const { clothingItemId } = req.params;
  ClothingItem.findById(clothingItemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(FORBIDDEN).send({ message: "Access id denied" });
      }
      return ClothingItem.findByIdAndDelete(clothingItemId).then(() =>
        res.status(SUCCESSFUL_REQUEST).send({ item })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
      }
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
        next(err);
      }
    });
};

const likeItem = (req, res) => {
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
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
      }
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
        next(err);
      }
    });
};

const unlikeItem = (req, res) => {
  const { clothingItemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    clothingItemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
      }
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST("The id string is in an invalid format"));
        next(err);
      }
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItemById,
  likeItem,
  unlikeItem,
};

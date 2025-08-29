const ClothingItem = require("../models/items");

const {
  INTERNAL_SERVER_ERROR,
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "error from createClothingItem" });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(SUCCESSFUL_REQUEST).send(items);
    })
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteClothingItemById = (req, res) => {
  const { clothingItemId } = req.params;
  ClothingItem.findById(clothingItemId)
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(FORBIDDEN).send({ message: "Access id denied" });
      }
      return ClothingItem.findByIdAndDelete(clothingItemId)
        .then(() => res.status(SUCCESSFUL_REQUEST).send({ item }));
    })
    .catch((err) => {
      console.error(err.status);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item is not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item is incorrect" });
      }
      return res.status(BAD_REQUEST).send({ message: err.message });
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
    .then((item) => res.status(SUCCESSFUL_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Invalid clothing item ID" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item is not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from likeItem" });
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
    .then((item) => res.status(SUCCESSFUL_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found " });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from unlikeItem" });
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItemById,
  likeItem,
  unlikeItem,
};

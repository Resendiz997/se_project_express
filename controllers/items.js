const ClothingItem = require("../models/items");



const {
  INTERNAL_SERVER_ERROR,
  SUCCESSFUL_REQUEST,
  CREATED_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../utils/erros");

//CREATE

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

//GET

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



//DELETE

const deleteClothingItemById = (req, res) => {
  const { clothingItemId } = req.params;
  ClothingItem.findByIdAndDelete(clothingItemId)
    .orFail()
    .then((item) => {

      return res.status(SUCCESSFUL_REQUEST).send({ item })})
    .catch((err) => {
      console.error(err.status);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item is not found" });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item is incorrect" });
      }
      res
        .status(BAD_REQUEST)
        .send({ message: "Error from deleteClothingItemById" });
    });
};




const likeItem = (req, res) => {
  const { clothingItemId } = req.params;
    ClothingItem.findByIdAndUpdate(clothingItemId, {
    $addToSet: { likes: req.user._id }},
    { new: true }
  ).orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Invalid clothing item ID" });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item is not found" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from likeItem" });
    });
};

const unlikeItem = (req, res) => {
  const { clothingItemId } = req.params;
  ClothingItem.findByIdAndUpdate(clothingItemId, { $pull: { likes: req.user._id } }, {new: true})
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found " });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }
      res
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

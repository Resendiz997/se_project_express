
const ClothingItem = require('../models/clothingItem');


//CREATE

const   createClothingItem = (req, res) => {
  const {name, weather, imageUrl} = req.body;
  ClothingItem.create({name,weather,imageUrl})
  .then((item)=>
    res.status(201).send({name: item})
  ).catch((err) => {
    console.error(err);
   res.status(500).send({message: "error from createClothingItem"});
});
}


//GET


const getClothingItems = (req,res) => {
  ClothingItem.find({}).then((items) => {
    res.status(200).send(items);
  }).catch((err) => {
    console.error(err);
    res.status(500).send({message: err.message});
  });
}

///UPDATE


const updateClothingItemById = (req, res) => {
  const {clothingItemId} = req.params;
  const {imageUrl} = req.body;
  ClothingItem.findByIdAndUpdate(clothingItemId, {$set: {imageUrl}}).orFail().then((item) => res.status(200).send({data:item}))
  .catch((err) => {
    res.status(500).send({message: "Error from updateClothingItemById"});
  })
}


//DELETE

const deleteClothingItemById = (req, res) => {
  const {clothingItemId} = req.params;
  ClothingItem.findByIdAndRemove(clothingItemId).orFail()
  .then((item) => res.status(204).send({}))
  .catch((err) => {
    res.status(500).send({message: "Error from deleteClothingItemById"});
})
};




module.exports = {createClothingItem, getClothingItems,deleteClothingItemById,updateClothingItemById};
const router = require('express').Router();

const {getClothingItems, createClothingItem,updateClothingItemById,deleteClothingItemById} = require('../controllers/clothingItems');


router.get("/",getClothingItems);
router.post("/",createClothingItem);
router.delete('/:clothingItemId',deleteClothingItemById);
router.put('/:clothingItemId',updateClothingItemById);


module.exports = router;
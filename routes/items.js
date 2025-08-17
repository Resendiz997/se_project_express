const router = require('express').Router();

const {getClothingItems, createClothingItem,deleteClothingItemById, likeItem, unlikeItem} = require('../controllers/items');


router.get("/",getClothingItems);
router.post("/",createClothingItem);
router.delete('/:clothingItemId',deleteClothingItemById);
router.put('/:clothingItemId/likes', likeItem);
router.delete('/:clothingItemId/likes', unlikeItem);



module.exports = router;
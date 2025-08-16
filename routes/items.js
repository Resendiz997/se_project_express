const router = require('express').Router();

const {getClothingItems, createClothingItem,updateClothingItemById,deleteClothingItemById, likeItem, unlikeItem} = require('../controllers/items');


router.get("/",getClothingItems);
router.post("/",createClothingItem);
router.delete('/:clothingItemId',deleteClothingItemById);
router.put('/:clothingItemId',updateClothingItemById);
router.put('/:clothingItemId/likes', likeItem);
router.delete('/:clothingItemId/likes', unlikeItem); // delete request to http://localhost:3001/items/1923j192fj19fj192jf19fj1f/unlikes
// req.params = {clothingItemId: '1923j192fj19fj192jf19fj1f'}



module.exports = router;
const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItemById,
  likeItem,
  unlikeItem,
} = require("../controllers/items");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:clothingItemId", auth, deleteClothingItemById);
router.put("/:clothingItemId/likes", auth, likeItem);
router.delete("/:clothingItemId/likes", auth, unlikeItem);

module.exports = router;

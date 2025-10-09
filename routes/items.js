const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItemById,
  likeItem,
  unlikeItem,
} = require("../controllers/items");

// starts with /items
router.get("/", getClothingItems); // GET to /items
router.post("/", auth, createClothingItem);
router.delete("/:clothingItemId", auth, deleteClothingItemById); // DELETE to /items/:clothingItemId
router.put("/:clothingItemId/likes", auth, likeItem);
router.delete("/:clothingItemId/likes", auth, unlikeItem);

module.exports = router;

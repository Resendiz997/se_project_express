const   router = require("express").Router();
const auth = require("../middlewares/auth");
const { objectIds, itemCreation } = require("../middlewares/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItemById,
  likeItem,
  unlikeItem,
} = require("../controllers/items");

// starts with /items
router.get("/", getClothingItems); // GET to /items
router.post("/", itemCreation, auth, createClothingItem);
router.delete("/:clothingItemId", objectIds, auth, deleteClothingItemById); // DELETE to /items/:clothingItemId
router.put("/:clothingItemId/likes", objectIds, auth, likeItem);
router.delete("/:clothingItemId/likes", objectIds, auth, unlikeItem);

module.exports = router;

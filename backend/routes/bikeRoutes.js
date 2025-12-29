const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { addBike, getBikeByUser } = require("../controllers/bikeController");

router.post("/", auth, addBike);
router.get("/:userId", auth, getBikeByUser);

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { addFuel, getFuelLogs } = require("../controllers/fuelController");

router.post("/", auth, addFuel);
router.get("/:bikeId", auth, getFuelLogs);

module.exports = router;

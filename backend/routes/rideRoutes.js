const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { addRide, getRides } = require("../controllers/rideController");

// Create a new ride
router.post("/", auth, addRide);

// Get all rides for a given bike
router.get("/:bikeId", auth, getRides);

module.exports = router;

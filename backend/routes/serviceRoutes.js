const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { addService, getServices } = require("../controllers/serviceController");

router.post("/", auth, addService);
router.get("/:bikeId", auth, getServices);

module.exports = router;

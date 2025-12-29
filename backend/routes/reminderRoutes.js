const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { addReminder, getReminders } = require("../controllers/reminderController");

router.post("/", auth, addReminder);
router.get("/:bikeId", auth, getReminders);

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { addExpense, getExpenses } = require("../controllers/expenseController");

router.post("/", auth, addExpense);
router.get("/:bikeId", auth, getExpenses);

module.exports = router;
